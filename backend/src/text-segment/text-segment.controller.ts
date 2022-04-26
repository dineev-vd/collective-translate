import { PostTextSegmentDto } from 'common/dto/text-piece.dto';
import { TEXT_SEGMENT_ENDPOINT } from 'common/constants';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TextSegmentService } from './text-segment.service';
import { ActionsService } from 'actions/actions.service';

@Controller(TEXT_SEGMENT_ENDPOINT)
export class TextSegmentController {
  constructor(
    private readonly textSegmentService: TextSegmentService,
    private readonly actionsService: ActionsService
    ) {}

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
    @Query('languageId') languageId?: string
  ) {
    return this.actionsService.getActionsBySegment(segmentId, languageId);
  }
}
