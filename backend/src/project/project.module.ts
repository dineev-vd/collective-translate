import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from 'entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TextSegment } from 'entities/text-segment.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { TranslationService } from 'translation/translation.service';
import { Action } from 'entities/action.entity';

@Module({
  controllers: [ProjectController],
  imports: [
    TypeOrmModule.forFeature([
      Project,
      TextSegment,
      SegmentTranslation,
      Action,
    ]),
  ],
  providers: [ProjectService, TextSegmentService, TranslationService],
})
export class ProjectModule {}
