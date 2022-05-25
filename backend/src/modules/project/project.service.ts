import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Project from 'entities/project.entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { ChangeProjectDto } from 'dto/project.dto';
import { File } from 'entities/file.entity';
import User from 'entities/user.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { Language } from 'util/enums';
import { FilesService } from 'modules/files/files.service';
import { TranslationService } from 'modules/translation/translation.service';
import { LanguageService } from 'modules/language/language.service';
import { PostTranslateLanguage } from 'dto/language.dto';

const { PRODUCTION } = process.env;

@Injectable()
export class ProjectService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    if (PRODUCTION) return;

    if ((await this.projectRepository.findOne(1)) != null) return;

    const user = new User();
    user.email = 'admin@admin.com';
    user.password = 'admin';
    user.name = 'Владислав Динеев';
    user.refreshToken = '';

    const editorUser = new User();
    editorUser.email = 'editor@editor.com';
    editorUser.password = 'editor';
    editorUser.name = 'Редактор Тест';
    editorUser.refreshToken = '';

    for (let i = 0; i < 3; i++) {
      const project = new Project();
      project.name = `Проект ${i}`;
      project.description = `Это описание проекта с номером ${i}`;

      const file = new File();
      file.name = 'Субтитры.srt';
      file.path = '../test.txt';
      file.encoding = 'utf-8';
      project.files = [file];
      project.owner = user;
      project.editors = i < 2 ? [editorUser] : [];
      project.private = i === 1;

      const translateLanguage = new TranslationLanguage();
      translateLanguage.language = Language.RUSSIAN;
      translateLanguage.original = true;
      translateLanguage.name = 'Русский';
      project.translateLanguage = [translateLanguage];
      const insertedProject = await this.projectRepository.save(project);

      await this.fileService.splitFile(insertedProject.files[0].id.toString());
      await this.createTranslation(insertedProject.id.toString(), {
        language: Language.ENGLISH,
      });
    }
  }

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private fileService: FilesService,
    private languageService: LanguageService,
    private translationsService: TranslationService,
  ) {}

  async createTranslation(id: string, language: PostTranslateLanguage) {
    const originalLanguage = await this.languageService.getOriginalLanguage(id);
    const createdLanguage = await this.languageService.saveLanguage({
      ...language,
      project: { id: Number(id) },
    });
    const files = await this.fileService.getFilesByProject(id);
    return Promise.all(
      files.map((file) =>
        this.translationsService.generateTranslationForFile(
          createdLanguage.id.toString(),
          file.id.toString(),
          originalLanguage.id.toString(),
        ),
      ),
    );
  }

  async findProjectsByUser(
    userId: string,
    params: { withPrivate?: boolean } = {},
  ) {
    if (params.withPrivate)
      return this.projectRepository.find({ where: { owner: { id: userId } } });

    return this.projectRepository.find({
      where: { owner: { id: userId }, private: false },
    });
  }

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

  async updateProject(projectId: string, project: ChangeProjectDto) {
    return this.projectRepository.update(projectId, project);
  }

  async findProjectByLanguage(languageId: string) {
    return this.projectRepository.findOne({
      where: { translateLanguage: { id: languageId } },
    });
  }
}
