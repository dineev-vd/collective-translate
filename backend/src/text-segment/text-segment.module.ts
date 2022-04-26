import { Module } from '@nestjs/common';
import { TextSegmentService } from './text-segment.service';
import { TextSegmentController } from './text-segment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextSegment } from 'entities/text-segment.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Action } from 'entities/action.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { ActionsModule } from 'actions/actions.module';

@Module({
  providers: [TextSegmentService],
  controllers: [TextSegmentController],
  imports: [
    ActionsModule,
    TypeOrmModule.forFeature([
      TextSegment,
      SegmentTranslation,
      Action,
      TranslationLanguage,
    ]),
  ],
  exports: [TextSegmentService],
})
export class TextpieceModule {}
