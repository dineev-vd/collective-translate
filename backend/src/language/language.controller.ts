import { Controller, Get, Param, Query } from '@nestjs/common';
import { TranslationService } from 'translation/translation.service';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(
    private readonly languageService: LanguageService,
    private readonly translationsService: TranslationService,
  ) {}

  @Get(':id')
  async getLanguageById(@Param('id') id: string) {
    return this.languageService.getTranslationLanguageById(id);
  }

  @Get('/')
  async getLanguagesByProjectId(@Query('projectId') projectId: number) {
    return this.languageService.getTranslationLanguagesByProjectId(projectId);
  }

  @Get(':id/translations')
  async getTranslationsByLanguage(
    @Param('id') languageId: string,
    @Query('fileId') fileId?: string,
  ) {
    return this.translationsService.getTranslationsByLanguage(
      languageId,
      fileId,
    );
  }
}
