import { Controller, Get, Param, Query } from '@nestjs/common';
import { TranslationService } from './translation.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TRANSLATION_ENDPOINT } from 'common/constants';
import { ActionsService } from 'actions/actions.service';
import { LanguageService } from 'language/language.service';
import { ProjectService } from 'project/project.service';

@Controller(TRANSLATION_ENDPOINT)
export class PiecesController {
  constructor(
    private readonly actionsService: ActionsService,
    private readonly translationService: TranslationService,
    private readonly languageService: LanguageService
  ) { }

  @Get(':id')
  async getTextPieceById(
    @Param('id') id: string,
    @Query('nextMinLength') nextMinLength?: number,
    @Query('prevMinLength') prevMinLength?: number,
    @Query('toLanguageId') toLanguageId?: number
  ) {
    return this.translationService.getSegmentWithNeighbours(id, { prev: prevMinLength, next: nextMinLength, toLanguageId: toLanguageId });
  }

  @Get(':id/actions')
  async getActions(
    @Param('id') segmentId: string,
  ) {
    return this.actionsService.getActionsBySegment(segmentId);
  }

  @Get(':id/languages')
  async getLanguages(
    @Param('id') segmentId: string
  ) {
    const project = await this.translationService.getProjectBySegment(segmentId);
    return this.languageService.getTranslationLanguagesByProjectId(project.id.toString());
  }

  @Get(':id/language')
  async getLanguage(
    @Param('id') segmentId: string
  ) {
    return this.translationService.getLanguageBySegment(segmentId);
  }
}
