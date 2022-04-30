import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostActionDto } from 'common/dto/action.dto';
import { Action } from 'entities/action.entity';
import User from 'entities/user.entity';
import { TranslationService } from 'translation/translation.service';
import { Repository, DeepPartial, ObjectLiteral, IsNull } from 'typeorm';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionsRepository: Repository<Action>,
    private readonly translationsService: TranslationService,
  ) { }

  async removeByFileId() { }

  // TODO

  async processAction(change: PostActionDto, user: User) {
    const action: DeepPartial<Action> = {};
    action.author = user;
    action.change = change.change;
    action.segment = { id: change.textSegmentId }

    if (change.comment) {
      action.comment = change.comment;
    }

    await this.translationsService.savePiece({ id: change.textSegmentId, translationText: change.change })
    return this.actionsRepository.save(action);
  }

  async getActionsBySegment(textSegmentId: string) {
    return this.actionsRepository.find({
      where: {
        segment: { id: textSegmentId },
      },
      relations: ['author']
    });
  }

  async insertActions(actions: DeepPartial<Action>[]) {
    return this.actionsRepository.createQueryBuilder().insert().values(actions).execute();
  }
}
