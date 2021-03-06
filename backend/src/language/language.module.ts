import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { FilesModule } from 'files/files.module';
import { TranslationModule } from 'translation/translation.module';
import { AssemblyModule } from 'assembly/assembly.module';

@Module({
  providers: [LanguageService],
  imports: [
    TypeOrmModule.forFeature([TranslationLanguage]),
    forwardRef(() => TranslationModule),
    forwardRef(() => FilesModule),
    AssemblyModule
  ],
  controllers: [LanguageController],
  exports: [LanguageService],
})
export class LanguageModule {}
