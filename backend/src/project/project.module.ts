import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Project from "@entities/Project.entity";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { TextpieceService } from "src/textpiece/textpiece.service";
import { TextpieceModule } from "src/textpiece/textpiece.module";
import { TextPiece } from "@entities/TextPiece.entity";
import TranslatePiece from "@entities/TranslatePiece.entity";

@Module({ 
    controllers: [ProjectController],
    imports: [TypeOrmModule.forFeature([Project, TextPiece, TranslatePiece])],
    providers: [ProjectService, TextpieceService] 
})
export class ProjectModule { }