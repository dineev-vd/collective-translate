import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Project from 'entities/project.entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as iconv from 'iconv-lite';
import { PostProjectDto } from 'common/dto/project.dto';
import { File } from 'entities/file.entity';
import User from 'entities/user.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { Language } from 'common/enums';
import { FilesService } from 'files/files.service';
import { TranslationService } from 'translation/translation.service';

@Injectable()
export class ProjectService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    if ((await this.projectRepository.findOne(1)) != null) return;

    const reg = /(\s+[^.!?]*[.!?])/g;
    let testString = '';
    const data = await fs.readFile('../test.txt');
    testString = iconv.decode(data, 'windows-1251');
    const user = new User();
    user.email = 'admin@admin.com';
    user.password = 'admin';
    user.name = 'Владислав Динеев';
    user.refreshToken = '';

    for (let i = 0; i < 2; i++) {
      const project = new Project();
      project.name = `Проект ${i}`;
      project.description = `Это описание проекта с номером ${i}`;

      const file = new File();
      file.name = 'Война и Мир.txt';
      file.path = '../test.txt';
      file.encoding = 'windows-1251';
      project.files = [file];
      project.owner = user;

      const translateLanguage = new TranslationLanguage();
      translateLanguage.language = Language.RUSSIAN;
      translateLanguage.original = true;
      project.translateLanguage = [translateLanguage];
      const insertedProject = await this.projectRepository.save(project);

      await this.fileService.splitFile(insertedProject.files[0].id.toString());
    }
  }

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private fileService: FilesService,
  ) { }

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

  async createProject(project: DeepPartial<Project>) {
    return this.projectRepository.save(project);
  }

  async updateProject(projectId: string, project: PostProjectDto) {
    return this.projectRepository.save(project);
  }

  async findProjectByLanguage(languageId: string) {
    return this.projectRepository.findOne({ where: { translateLanguage: { id: languageId } } })
  }
}
