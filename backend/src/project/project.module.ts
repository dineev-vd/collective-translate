import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Project from "entities/Project.entity";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { TextPiece } from "entities/TextPiece.entity";
import TranslatePiece from "entities/TranslatePiece.entity";
import { TextpieceService } from "TextPiece/TextPiece.service";
import { PieceService } from "translate-piece/piece.service";
import { TranslatePieceEdit } from "entities/TranslatePieceEdit.entity";

@Module({ 
    controllers: [ProjectController],
    imports: [TypeOrmModule.forFeature([Project, TextPiece, TranslatePiece, TranslatePieceEdit])],
    providers: [ProjectService, TextpieceService, PieceService] 
})
export class ProjectModule { }