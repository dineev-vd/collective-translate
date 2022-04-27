import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(TranslationLanguage)
    private readonly languageRepository: Repository<TranslationLanguage>,
  ) {}

  async getTranslationLanguageById(id: string) {
    return this.languageRepository.findOne(id);
  }

  async getTranslationLanguagesByProjectId(projectId: number) {
    return this.languageRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async setActionsRelations(languageId: string, actionIds: ObjectLiteral[]) {
    return this.languageRepository
      .createQueryBuilder()
      .relation('actions')
      .of(languageId)
      .add(actionIds);
  }

  async createLanguage(language: DeepPartial<TranslationLanguage>) {
    return this.languageRepository.save(language);
  }
}
