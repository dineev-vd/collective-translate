import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TRANSLATION_ENDPOINT } from 'common/constants';
import { ActionsService } from 'actions/actions.service';
import { LanguageService } from 'language/language.service';

import { SuggestionsService } from 'suggestions/suggestions.service';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { PostTranslationDto } from 'common/dto/translate-piece.dto';
import { use } from 'passport';
import { SegmentStatus } from 'common/enums';

@Controller(TRANSLATION_ENDPOINT)
export class PiecesController {
  constructor(
    private readonly actionsService: ActionsService,
    private readonly translationService: TranslationService,
    private readonly languageService: LanguageService,
    private readonly suggestionService: SuggestionsService,
  ) {}

  @Get(':id/suggestions') async getSuggestions(
    @Param('id') segmentId: string,
  ) {
    return this.suggestionService.getSuggestiont(segmentId);
  }

  @Get(':id')
  async getTextPieceById(
    @Param('id') id: string,
    @Query('nextMinLength') nextMinLength?: number,
    @Query('prevMinLength') prevMinLength?: number,
    @Query('toLanguageId') toLanguageId?: number,
    @Query('withOriginal') withOriginal?: Boolean,
  ) {
    return this.translationService.getSegmentWithNeighbours(id, {
      prev: prevMinLength,
      next: nextMinLength,
      toLanguageId: toLanguageId,
      withOriginal: withOriginal,
    });
  }

  @Get(':id/actions')
  async getActions(@Param('id') segmentId: string) {
    return this.actionsService.getActionsBySegment(segmentId);
  }

  @Get(':id/languages')
  async getLanguages(@Param('id') segmentId: string) {
    const project = await this.translationService.getProjectBySegment(
      segmentId,
    );
    return this.languageService.getTranslationLanguagesByProjectId(
      project.id.toString(),
    );
  }

  @Get(':id/language')
  async getLanguage(@Param('id') segmentId: string) {
    return this.translationService.getLanguageBySegment(segmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/suggest')
  async suggest(
    @Param('id') segmentId: string,
    @Body() { suggestion }: { suggestion: string },
    @Req() { user }: ExtendedRequest,
  ) {
    return this.suggestionService.suggestTranslation(
      segmentId,
      suggestion,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async putTranslations(
    @Req() { user }: ExtendedRequest,
    @Body() changes: PostTranslationDto[] 
  ) {
    const project = await this.translationService.getProjectBySegment(changes[0].id.toString());

    if(!(project.editorsId.includes(user.id.toString()) || project.ownerId == user.id.toString())) {
      throw new ForbiddenException();
    }

    return this.translationService.putTranslations(changes, user);
  }
}
