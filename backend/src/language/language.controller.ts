import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AssemblyService } from 'assembly/assembly.service';
import { FilesService } from 'files/files.service';
import { TranslationService } from 'translation/translation.service';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(
    private readonly languageService: LanguageService,
    private readonly translationsService: TranslationService,
    private readonly filesService: FilesService,
    private readonly assemblyService: AssemblyService
  ) { }

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
    return this.translationsService.getTranslationsByProject(
      languageId,
      fileId,
    );
  }

  @Post(':id/assemble')
  async assembleFiles(@Param('id') languageId: string) {
    const language = await this.languageService.getTranslationLanguageById(languageId);
    const files = await this.filesService.getFilesByProject(language.projectId.toString());
    return Promise.all(files.map(file => this.filesService.assembleFile(file.id.toString(), languageId)));
  }

  @Get(`:id/assemblies`)
  async getAssemblies(@Param('id') languageId: string) {
    return this.assemblyService.getAssembliesByLanguageId(languageId);
  }
}
