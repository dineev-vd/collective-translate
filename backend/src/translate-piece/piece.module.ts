import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PiecesController } from "./piece.controller";
import { PieceService } from "./piece.service";
import TranslatePiece from "entities/TranslatePiece.entity";

@Module({ 
    controllers: [PiecesController],
    imports: [TypeOrmModule.forFeature([TranslatePiece])],
    providers: [PieceService] 
})
export class PieceModule { }