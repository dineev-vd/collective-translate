import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PiecesController } from "./piece.controller";
import { PieceService } from "./piece.service";
import TranslatePiece from "entities/TranslatePiece.entity";
import { TranslatePieceEdit } from "entities/TranslatePieceEdit.entity";

@Module({ 
    controllers: [PiecesController],
    imports: [TypeOrmModule.forFeature([TranslatePiece, TranslatePieceEdit])],
    providers: [PieceService] 
})
export class PieceModule { }