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

  async getTranslationLanguagesByProjectId(projectId: string) {
    return this.languageRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async saveLanguage(language: DeepPartial<TranslationLanguage>) {
    return this.languageRepository.save(language);
  }

  async getOriginalLanguage(projectId: string) {
    return this.languageRepository.findOne({
      where: { project: { id: projectId }, original: true },
    });
  }
}
