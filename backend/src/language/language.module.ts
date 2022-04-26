import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TranslationService } from 'translation/translation.service';
import { Action } from 'entities/action.entity';
import { TextpieceModule } from 'text-segment/text-segment.module';

@Module({
  providers: [LanguageService, TranslationService],
  imports: [
    TypeOrmModule.forFeature([TranslationLanguage, SegmentTranslation, Action]),
    TextpieceModule,
  ],
  controllers: [LanguageController],
  exports: [LanguageService],
})
export class LanguageModule {}
