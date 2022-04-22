import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'entities/action.entity';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { TranslationService } from 'translation/translation.service';
import { TextSegment } from 'entities/text-segment.entity';
import SegmentTranslation from 'entities/segment-translation.entity';

@Module({
  providers: [ActionsService, TextSegmentService, TranslationService],
  controllers: [ActionsController],
  imports: [TypeOrmModule.forFeature([Action, TextSegment, SegmentTranslation])]
})
export class ActionsModule {}
