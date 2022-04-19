import { Module } from '@nestjs/common';
import { TextpieceService } from './TextPiece.service';
import { TextpieceController } from './TextPiece.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextPiece } from 'entities/TextPiece.entity';

@Module({
  providers: [TextpieceService],
  controllers: [TextpieceController],
  imports: [TypeOrmModule.forFeature([TextPiece])],
  exports: [TextpieceService]
})
export class TextpieceModule {}
