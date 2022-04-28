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

  @Get(':id/order/:order')
  async getTextPieceById(
    @Param('id') id: string,
    @Param('order') order: number,
    @Query('nextMinLength') nextMinLength?: number,
    @Query('prevMinLength') prevMinLength?: number,
  ) {
    return this.translationsService.getSegmentWithNeighbours(id, Number(order), { prev: prevMinLength, next: nextMinLength });
  }

  @Get(':id/translations-orders') 
  async getTranslationsByOrder(
    @Param('id') languageId: string,
    @Query('orders') orders: string
  ) {
    return this.translationsService.getTranslationsByOrder(languageId, orders.split(',').map(o => Number(o)));
  }

  @Get(':id/translations')
  async getTranslationsByLanguage(
    @Param('id') languageId: string,
    @Query('fileId') fileId?: string,
    @Query('take') take?: number,
    @Query('page') page?: number,
  ) {
    return this.translationsService.getTranslationsByProject({ languageId: languageId, fileId: fileId, take: take, page: page });
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
