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
    private readonly translationsService: TranslationService
  ) { }

  async removeByFileId() {
    
  }

  async processAction(change: PostActionDto, user: User) {
    const action: DeepPartial<Action> = {};
    action.author = user;
    action.change = change.change;
    action.language = change.languageId ? { id: change.languageId } : null;
    action.segment = change.languageId ? { id: change.textSegmentId } : { id: change.textSegmentId, text: change.change };

    if (change.comment) {
      action.comment = change.comment;
    }

    if (change.languageId) {
      const [translation] = await this.translationsService.getTranslationsByTextSegmentsAndLanguage([change.textSegmentId.toString()], change.languageId.toString());
      translation.translationText = change.change;
      await this.translationsService.savePiece(translation);
    }

    return this.actionsRepository.save(action);
  }

  async getActionsBySegment(textSegmentId: string, languageId?: string) {
    return this.actionsRepository.find({ where: { segment: { id: textSegmentId }, language: { id: Number(languageId) ? languageId : IsNull() } } });
  }

  async insertActions(actions: Action[]) {
    return this.actionsRepository.insert(actions);
  }

  async setSegmentRelations(actionIds: ObjectLiteral[], segmentsIds: ObjectLiteral[]) {
    return Promise.all(actionIds.map((id, i) => {
      return this.actionsRepository.createQueryBuilder()
        .relation('segment')
        .of(id)
        .set(segmentsIds[i])
    }))
  }
}
