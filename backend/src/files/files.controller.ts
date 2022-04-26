import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FILE_ENDPOINT } from 'common/constants';
import { LanguageService } from 'language/language.service';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { TranslationService } from 'translation/translation.service';
import { FilesService } from './files.service';
import * as fs from 'fs/promises';
import * as iconv from 'iconv-lite';
import * as crypto from 'crypto';

@Controller(FILE_ENDPOINT)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly translationsService: TranslationService,
    private readonly languageService: LanguageService,
    private readonly textSegmentService: TextSegmentService,
  ) { }

  @Get(`:id`)
  async getTextSegments(
    @Param('id') id: string,
    @Query('take') take: number,
    @Query('page') page: number
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
    const file = await this.filesService.getFileById(id);
    const bulkSize = 1000;
    let offset = 0;
    let currentBulk = await this.textSegmentService.getBatch(
      id,
      offset,
      bulkSize,
    );
    const fileName = crypto.randomUUID();
    const fileWrite = await fs.open(fileName, 'a+');

    while (currentBulk.length > 0) {
      offset += bulkSize;

      const stringToWrite = currentBulk
        .map((segment) => {
          return segment.shouldTranslate && segment.translations[0]
            ? segment.translations[0].translationText
            : segment.text;
        })
        .join('');

      await fileWrite.appendFile(iconv.encode(stringToWrite, file.encoding));

      currentBulk = await this.textSegmentService.getBatch(
        id,
        offset,
        bulkSize,
      );
    }

    await fileWrite.close();
    return this.filesService.createAssembly(file, fileName);
  }
}
