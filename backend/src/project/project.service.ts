import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Project from 'entities/project.entity';
import { ILike, Repository } from 'typeorm';
import SegmentTranslation from 'entities/segment-translation.entity';
import * as fs from 'fs/promises';
import * as iconv from 'iconv-lite';
import { TextSegment } from 'entities/text-segment.entity';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { PostProjectDto, GetProjectDto } from 'common/dto/project.dto';
import { File } from 'entities/file.entity';
import User from 'entities/user.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { Language } from 'common/enums';

@Injectable()
export class ProjectService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    if(await this.projectRepository.findOne(1) != null)
      return;

    const reg = /(\s+[^.!?]*[.!?])/g;
    let testString = '';
    const data = await fs.readFile('../test.txt');
    testString = iconv.decode(data, 'windows-1251');
    const user = new User();
    user.email = 'admin@admin.com';
    user.password = 'admin';
    user.name = 'Владислав Динеев';
    user.refreshToken = '';

    for (let i = 0; i < 1; i++) {
      const project = new Project();
      project.name = `Проект ${i}`;
      project.description = `Это описание проекта с номером ${i}`;

      const file = new File();
      file.textSegments = await this.formTextSegments(reg, testString);
      file.name = 'Война и Мир.txt';

      project.files = [file];
      project.owner = user;

      const translateLanguage = new TranslationLanguage();
      translateLanguage.language = Language.ENGLISH;

      project.translateLanguage = [translateLanguage];

      translateLanguage.translationSegments = file.textSegments
        .filter((segment) => segment.shouldTranslate)
        .map((segment) => {
          const translation = new SegmentTranslation();
          translation.textSegment = segment;
          return translation;
        });

      await this.projectRepository.save(project);
      // const finalArr = await this.formTranslatePieces(project, reg, projectRes.text);
      // await this.translateRepository.save(finalArr);
    }
  }

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findProjectsByQuery(query: string) {
    return this.projectRepository.find({
      where: { name: ILike(`%${query}%`) },
      select: ['id', 'name', 'description'],
    });
  }

  async findProjectById(id: string) {
    return this.projectRepository.findOne(id, {
      relations: ['owner', 'translateLanguage'],
    });
  }

  async createProject(project: PostProjectDto) {
    return this.projectRepository.insert(project);
  }

  async updateProject(projectId: string, project: PostProjectDto) {
    return this.projectRepository.update(projectId, project);
  }

  async formTextSegments(
    re: RegExp,
    completeText: string,
  ): Promise<TextSegment[]> {
    const array = completeText
      .split(re)
      .map((splitPart, index) => {
        if (splitPart.length === 0) return null;

        const textSegment = new TextSegment();
        textSegment.shouldTranslate = index % 2 !== 0;
        textSegment.text = splitPart;

        return textSegment;
      })
      .filter((segment) => segment != null);
    array.forEach((segment, index, array) => {
      if (index === 0) return;

      array[index - 1].next = segment;
      segment.previous = array[index - 1];
    });

    return array;
  }
}
