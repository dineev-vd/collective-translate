import { Module } from '@nestjs/common';
import { TextpieceService } from './TextPiece.service';
import { TextpieceController } from './TextPiece.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextSegment } from 'entities/text-segment.entity';

@Module({
  providers: [TextpieceService],
  controllers: [TextpieceController],
  imports: [TypeOrmModule.forFeature([TextSegment])],
  exports: [TextpieceService]
})
export class TextpieceModule {}
