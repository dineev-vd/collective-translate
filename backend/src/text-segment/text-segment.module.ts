import { Module } from '@nestjs/common';
import { TextSegmentService } from './text-segment.service';
import { TextSegmentController } from './text-segment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextSegment } from 'entities/text-segment.entity';
import { TranslationService } from 'translation/translation.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Action } from 'entities/action.entity';
import { LanguageService } from 'language/language.service';
import { TranslationLanguage } from 'entities/translation-language.entity';

@Module({
  providers: [TextSegmentService, LanguageService],
  controllers: [TextSegmentController],
  imports: [
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
