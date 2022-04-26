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
    @Query('ids') idsString: string,
    @Query('file') fileId: string,
  ): Promise<SegmentTranslation[]> {
    if (languageId && textSegmentsIdsString) {
      const textSegmentsIds = textSegmentsIdsString.split(',');
      return this.translationsService.getTranslationsByTextSegmentsAndLanguage(
        textSegmentsIds,
        languageId,
      );
    }

    if (idsString) {
      const ids = idsString.split(',');
      return this.translationsService.getPieces(ids);
    }

    if (languageId && fileId) {
      return this.translationsService.getTranslationsByLanguage(
        languageId,
        fileId,
      );
    }

    if (languageId) {
      return this.translationsService.getTranslationsByLanguage(languageId);
    }
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
}
