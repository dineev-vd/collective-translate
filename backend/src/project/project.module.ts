import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Project from "entities/project.entity";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { TextSegment } from "entities/text-segment.entity";
import SegmentTranslation from "entities/segment-translation.entity";
import { TextpieceService } from "TextPiece/TextPiece.service";
import { PieceService } from "translate-piece/piece.service";
import { Action } from "entities/action.entity";

@Module({ 
    controllers: [ProjectController],
    imports: [TypeOrmModule.forFeature([Project, TextSegment, SegmentTranslation, Action])],
    providers: [ProjectService, TextpieceService, PieceService] 
})
export class ProjectModule { }