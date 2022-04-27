import { forwardRef, Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'entities/action.entity';
import { TextSegment } from 'entities/text-segment.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TranslationModule } from 'translation/translation.module';

@Module({
  providers: [ActionsService],
  controllers: [ActionsController],
  imports: [
    TypeOrmModule.forFeature([Action, TextSegment, SegmentTranslation]),
    forwardRef(() => TranslationModule),
  ],
  exports: [ActionsService],
})
export class ActionsModule {}
