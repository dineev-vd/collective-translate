import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PiecesController } from "./piece.controller";
import { PieceService } from "./piece.service";
import SegmentTranslation from "entities/segment-translation.entity";
import { Action } from "entities/action.entity";

@Module({ 
    controllers: [PiecesController],
    imports: [TypeOrmModule.forFeature([SegmentTranslation, Action])],
    providers: [PieceService] 
})
export class PieceModule { }