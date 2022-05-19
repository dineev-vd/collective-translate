import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SegmentStatus } from 'common/enums';
import { Action } from 'entities/action.entity';
import { Suggestion } from 'entities/suggestion.entity';
import User from 'entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectRepository(Suggestion)
    private readonly suggestionRepository: Repository<Suggestion>,
  ) {}

  async suggestTranslation(segmentId: string, suggestion: string, user: User) {
    const suggestionEntity: DeepPartial<Suggestion> = {};
    suggestionEntity.suggestion = suggestion;
    suggestionEntity.author = user;
    suggestionEntity.segment = {
      id: segmentId,
    };

    return this.suggestionRepository.save(suggestionEntity);
  }

  async approveSuggestion(suggestionId: string) {
    const suggestion = await this.suggestionRepository.findOne(suggestionId, {
      relations: ['segment', 'author', 'segment.actions'],
    });

    const action = new Action();
    action.author = suggestion.author;
    action.change = suggestion.suggestion;
    action.comment = 'Изменено по предложению';
    suggestion.segment.actions.push(action);

    suggestion.segment.translationText = suggestion.suggestion;
    suggestion.segment.status = SegmentStatus.TRANSLATED;

    const savedSegment = await this.suggestionRepository.save(suggestion);
    await this.suggestionRepository.delete(suggestion);
    return savedSegment;
  }

  async denySuggestion(suggestionId: string) {
    const suggestion = await this.suggestionRepository.findOne(suggestionId, {
      relations: ['segment', 'segment.suggestions'],
    });

    if (suggestion.segment.suggestions.length <= 1) {
      suggestion.segment.status = SegmentStatus.NEW;
    }

    return this.suggestionRepository.delete(suggestionId);
  }

  async getSuggestiont(segmentId: string) {
    return this.suggestionRepository.find({
      where: { segment: { id: segmentId } },
      relations: ['author']
    });
  }

  async getSegmentBySuggestion(suggestionId: string) {
    return (
      await this.suggestionRepository.findOne(suggestionId, {
        relations: ['segment'],
      })
    ).segment;
  }
}
