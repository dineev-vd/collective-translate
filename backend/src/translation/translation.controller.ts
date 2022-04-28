import { Controller, Get, Param, Query } from '@nestjs/common';
import { TranslationService } from './translation.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TRANSLATION_ENDPOINT } from 'common/constants';
import { ActionsService } from 'actions/actions.service';

@Controller(TRANSLATION_ENDPOINT)
export class PiecesController {
  constructor(
    private readonly translationsService: TranslationService,
    private readonly actionsService: ActionsService
  ) { }

  @Get(':id')
  async getTextPieceById(
    @Param('id') id: string,
    @Query('nextMinLength') nextMinLength?: number,
    @Query('prevMinLength') prevMinLength?: number,
  ) {
    return this.translationsService.getSegmentWithNeighbours(id, { prev: prevMinLength, next: nextMinLength });
  }

  @Get(':id/actions')
  async getActions(
    @Param('id') segmentId: string,
  ) {
    return this.actionsService.getActionsBySegment(segmentId);
  }
}
