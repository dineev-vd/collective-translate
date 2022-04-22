import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTextSegmentDto } from 'common/dto/text-piece.dto';
import { PostTranslationDto } from 'common/dto/translate-piece.dto';
import { Action } from 'entities/action.entity';
import User from 'entities/user.entity';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { TranslationService } from 'translation/translation.service';
import { Repository } from 'typeorm';

@Injectable()
export class ActionsService {
    constructor(
        @InjectRepository(Action)
        private readonly actionsRepository: Repository<Action>,
        private readonly translationService: TranslationService,
        private readonly textSegmentService: TextSegmentService
    ) { }

    async updateTranslationActions(user: User, changes: PostTranslationDto[]) {
        return changes.map(async change => {
            const piece = await this.translationService.getPiece(change.id.toString());

            if(!piece) {
                return null;
            }

            const action = new Action();
            action.author = user;
            action.change = change.translationText;
            action.comment = change.comment;
            action.segment = piece;

            return this.actionsRepository.save(action);
        })
    }

    // async updateTextSegmentsActions(user: User, changes: PostTextSegmentDto[]) {
    //     return changes.map(async change => {
    //         const piece = await this.textSegmentService.getPiece(change.id);

    //         if(!piece) {
    //             return null;
    //         }

    //         const action = new Action();
    //         action.author = user;
    //         action.change = change.text;
    //         action.comment = change.comment;
    //         action. = piece;

    //         return this.actionsRepository.save(action);
    //     })
    // }
}
