import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from 'common/enums';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';

@Module({
  providers: [LanguageService],
  imports: [TypeOrmModule.forFeature([TranslationLanguage])],
  controllers: [LanguageController],
})
export class LanguageModule {}
