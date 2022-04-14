import { Module } from '@nestjs/common';
import { TextpieceService } from './textpiece.service';
import { TextpieceController } from './textpiece.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextPiece } from '@entities/TextPiece.entity';

@Module({
  providers: [TextpieceService],
  controllers: [TextpieceController],
  imports: [TypeOrmModule.forFeature([TextPiece])],
  exports: [TextpieceService]
})
export class TextpieceModule {}
