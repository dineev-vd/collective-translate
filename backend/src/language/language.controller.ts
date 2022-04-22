import { Controller, Get, Param, Query } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get(':id')
  async getLanguageById(@Param('id') id: number) {
    return this.languageService.getTranslationLanguageById(id);
  }

  @Get('/')
  async getLanguagesByProjectId(@Query('projectId') projectId: number) {
    return this.languageService.getTranslationLanguagesByProjectId(projectId);
  }
}
