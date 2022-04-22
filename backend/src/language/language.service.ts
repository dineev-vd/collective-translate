import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(TranslationLanguage)
    private readonly languageRepository: Repository<TranslationLanguage>,
  ) {}

  async getTranslationLanguageById(id: number) {
    return this.languageRepository.findOne(id, {
      relations: ['translationSegments', 'translationSegments.textSegment'],
    });
  }

  async getTranslationLanguagesByProjectId(projectId: number) {
    return this.languageRepository.find({
      where: { project: { id: projectId } },
    });
  }
}
