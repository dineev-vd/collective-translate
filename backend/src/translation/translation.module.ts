import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PiecesController } from './translation.controller';
import { TranslationService } from './translation.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Action } from 'entities/action.entity';

@Module({
  controllers: [PiecesController],
  imports: [TypeOrmModule.forFeature([SegmentTranslation, Action])],
  providers: [TranslationService],
})
export class PieceModule {}
