import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PiecesController } from './translation.controller';
import { TranslationService } from './translation.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Action } from 'entities/action.entity';
import { LanguageModule } from 'language/language.module';
import { ActionsModule } from 'actions/actions.module';
import { SuggestionsModule } from 'suggestions/suggestions.module';

@Module({
  controllers: [PiecesController],
  imports: [
    TypeOrmModule.forFeature([
      SegmentTranslation,
      Action
    ]),
    LanguageModule,
    forwardRef(() => SuggestionsModule),
    forwardRef(() => ActionsModule),
  ],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
