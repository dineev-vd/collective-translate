import { Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import Project from "@entities/Project.entity";
import { ProjectService } from "./project.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get()
  async getProjectsByQuery(@Query('query') query: string): Promise<Project[]> {
    return this.projectService.searchProject(query);
  }


  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectService.getProject(id);
  }

  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }
}