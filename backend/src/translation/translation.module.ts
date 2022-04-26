import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PiecesController } from './translation.controller';
import { TranslationService } from './translation.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Action } from 'entities/action.entity';
import { LanguageService } from 'language/language.service';
import { TextSegment } from 'entities/text-segment.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { TextpieceModule } from 'text-segment/text-segment.module';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { LanguageModule } from 'language/language.module';
import { ActionsModule } from 'actions/actions.module';

@Module({
  controllers: [PiecesController],
  imports: [
    TypeOrmModule.forFeature([
      SegmentTranslation,
      Action,
      TextSegment,
      TranslationLanguage,
    ]),
    LanguageModule,
    TextpieceModule,
    forwardRef(() => ActionsModule)
  ],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
