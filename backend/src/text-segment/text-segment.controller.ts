import { GetTextSegmentDto, PostTextSegmentDto } from 'common/dto/text-piece.dto';
import { PROJECT_ENDPOINT, TEXT_SEGMENT_ENDPOINT } from 'common/constants';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TextSegmentService } from './text-segment.service';
import { TranslationService } from 'translation/translation.service';
import { LanguageService } from 'language/language.service';
import { TextSegment } from 'entities/text-segment.entity';

@Controller(TEXT_SEGMENT_ENDPOINT)
export class TextSegmentController {
  constructor(
    private readonly textSegmentService: TextSegmentService,
    private readonly languageService: LanguageService,
  ) { }

  @Get(':id')
  async getTextPieceById(
    @Param('id') id: number,
    @Query('nextMinLength') nextMinLength?: number,
    @Query('prevMinLength') prevMinLength?: number,
    @Query('languageId') languageId?: number
  ) {
    const mainSegment = await this.textSegmentService.getPiece(id);

    let nextArray: TextSegment[] = [];
    if (nextMinLength) {
      let currentLength = 0;
      let currentSegment = mainSegment;
      while (currentLength < nextMinLength && currentSegment.nextId != null) {
        currentSegment = await this.textSegmentService.getPiece(
          currentSegment.nextId
        );

        currentLength += currentSegment.text.length;
        nextArray = [...nextArray, currentSegment];
      }
    }

    let prevArray: TextSegment[] = [];
    if (prevMinLength) {
      let currentLength = 0;
      let currentSegment = mainSegment;
      while (
        currentLength < prevMinLength &&
        currentSegment.previousId != null
      ) {
        currentSegment = await this.textSegmentService.getPiece(
          currentSegment.previousId,
        );

        currentLength += currentSegment.text.length;
        prevArray = [currentSegment, ...prevArray];
      }
    }

    return [...prevArray, mainSegment, ...nextArray];
  }

  @Post(':id')
  async postTextPieceById(@Body() pieces: PostTextSegmentDto[]) {
    return this.textSegmentService.savePieces(pieces);
  }
}
