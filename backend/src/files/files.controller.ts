import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FILE_ENDPOINT } from 'common/constants';
import { LanguageService } from 'language/language.service';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { TranslationService } from 'translation/translation.service';
import { FilesService } from './files.service';

@Controller(FILE_ENDPOINT)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly translationsService: TranslationService,
    private readonly languageService: LanguageService,
    private readonly textSegmentService: TextSegmentService,
  ) {}

  @Get(`:id`)
  async getTextSegments(
    @Param('id') id: string,
    @Query('take') take: number,
    @Query('page') page: number,
  ) {
    return this.textSegmentService.getPiecesByFile(id, take, page);
  }

  @Get(`:id/peek`)
  async getPeek(@Param('id') id: string) {
    return this.filesService.peekFileById(id, 5000);
  }

  @Post(`:id/split`)
  async splitFile(@Param('id') id: string) {
    const process = async () => {
      const file = await this.filesService.getFileById(id);
      await this.filesService.splitFile(id);
      const languages =
        await this.languageService.getTranslationLanguagesByProjectId(
          file.projectId,
        );
      languages.forEach(async (language) => {
        await this.translationsService.generateTranslationForFile(
          language.id.toString(),
          id,
        );
      });
    };

    process();

    return { response: 'File is being processed' };
  }

  @Get(`:id/assemble`)
  async assembleFile(
    @Param('id') id: string,
    @Query('languageId') languageId: string,
  ) {
    return this.filesService.assembleFile(id, languageId);
  }
}
