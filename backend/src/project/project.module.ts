import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from 'entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Action } from 'entities/action.entity';
import { File } from 'entities/file.entity';
import { FilesModule } from 'files/files.module';
import { TranslationModule } from 'translation/translation.module';
import { LanguageModule } from 'language/language.module';
import { ActionsModule } from 'actions/actions.module';

@Module({
  controllers: [ProjectController],
  imports: [
    TranslationModule,
    FilesModule,
    ActionsModule,
    LanguageModule,
    TypeOrmModule.forFeature([
      Project,
      SegmentTranslation,
      Action,
      File,
    ]),
  ],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
