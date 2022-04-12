import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Project from "@entities/Project.entity";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({ 
    controllers: [ProjectController],
    imports: [TypeOrmModule.forFeature([Project])],
    providers: [ProjectService] 
})
export class ProjectModule { }