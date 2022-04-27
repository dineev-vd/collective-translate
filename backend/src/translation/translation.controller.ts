import { Controller, Get, Param, Query } from '@nestjs/common';
import { TranslationService } from './translation.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TRANSLATION_ENDPOINT } from 'common/constants';

@Controller(TRANSLATION_ENDPOINT)
export class PiecesController {
  constructor(private readonly translationsService: TranslationService) {}

  @Get(':id')
  async getPieceById(@Param('id') id: string): Promise<SegmentTranslation> {
    return this.translationsService.getPiece(id);
  }

  @Get('/')
  async getPieceByLanguage(
    @Query('languageId') languageId: string,
    @Query('textSegmentsIds') textSegmentsIdsString: string,
  ): Promise<SegmentTranslation[]> {
    if (languageId && textSegmentsIdsString) {
      const textSegmentsIds = textSegmentsIdsString.split(',');
      return this.translationsService.getTranslationsByTextSegmentsAndLanguage(
        textSegmentsIds,
        languageId
      );
    }

    // if (languageId) {
    //   return this.translationsService.getTranslationsByLanguage(languageId);
    // }
  }

  // @Post('/')
  // async updatePieces(@Body() pieces: Partial<PostTranslationDto>[], @Query('id') id: string) {
  //     await this.translationsService.updatePieces(id, pieces)
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post(':id')
  // async updatePiece(@Request() { user }: ExtendedRequest, @Body() piece: PostTranslatePieceDto, @Param('id') id: string) {
  //     await this.translationsService.updatePiece(id, user, piece)
  //     return this.translationsService.getPiece(id);
  // }

  @Get(':id')
  async getTextPieceById(
    @Param('id') id: number,
    @Query('nextMinLength') nextMinLength?: number,
    @Query('prevMinLength') prevMinLength?: number,
  ) {
    const mainSegment = await this.textSegmentService.getPiece(id);
    let arr = [mainSegment];

    if (nextMinLength) {
      const nextArray = await this.textSegmentService.getNext(mainSegment, 20);
      arr = [...arr, ...nextArray];
    }

    if (prevMinLength) {
      const prevArray = await this.textSegmentService.getPrev(mainSegment, 20);
      arr = [...prevArray, ...arr];
    }

    return arr;
  }

  @Get(':id/actions')
  async getActions(
    @Param('id') segmentId: string,
    @Query('languageId') languageId?: string,
  ) {
    return this.actionsService.getActionsBySegment(segmentId, languageId);
  }
}
