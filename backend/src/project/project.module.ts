import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from 'entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TextSegment } from 'entities/text-segment.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Action } from 'entities/action.entity';
import { File } from 'entities/file.entity';
import { FilesModule } from 'files/files.module';
import { TranslationModule } from 'translation/translation.module';

@Module({
  controllers: [ProjectController],
  imports: [
    TranslationModule,
    FilesModule,
    TypeOrmModule.forFeature([
      Project,
      TextSegment,
      SegmentTranslation,
      Action,
      File,
    ]),
  ],
  providers: [ProjectService],
})
export class ProjectModule {}
