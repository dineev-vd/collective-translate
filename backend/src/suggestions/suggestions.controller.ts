import { Controller, ForbiddenException, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { TranslationService } from 'translation/translation.service';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionService: SuggestionsService,
    private readonly translationService: TranslationService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/approve')
  async approve(@Param('id') id: string, @Req() { user }: ExtendedRequest) {
    const segment = await this.suggestionService.getSegmentBySuggestion(id);
    const project = await this.translationService.getProjectBySegment(segment.id.toString());

    if(!(project.editorsId.includes(user.id.toString()) || project.ownerId == user.id.toString())) {
      throw new ForbiddenException();
    }

    return this.suggestionService.approveSuggestion(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/deny')
  async deny(@Param('id') id: string, @Req() { user }: ExtendedRequest) {
    const segment = await this.suggestionService.getSegmentBySuggestion(id);
    const project = await this.translationService.getProjectBySegment(segment.id.toString());

    if(!(project.editorsId.includes(user.id.toString()) || project.ownerId == user.id.toString())) {
      throw new ForbiddenException();
    }
    
    return this.suggestionService.denySuggestion(id);
  }
}
