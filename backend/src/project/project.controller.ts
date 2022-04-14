import { Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import Project from "@entities/Project.entity";
import { ProjectService } from "./project.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import chardet from "chardet";
import * as iconv from "iconv-lite";
import { TextpieceService } from "src/textpiece/textpiece.service";


@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private textpieceService: TextpieceService
    ) { }

  @Get()
  async getProjectsByQuery(@Query('query') query: string): Promise<Project[]> {
    return this.projectService.searchProject(query);
  }


  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectService.getProject(id);
  }

  @Post('upload/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Param('id') id: string) {
    const project = await this.projectService.getProject(id);
    files.forEach((file) => {
      const fileBuf = file.buffer;
      const analyzed = chardet.analyse(fileBuf);
      const fileString = iconv.decode(fileBuf, analyzed[0].name);
      this.textpieceService.splitText(project, fileString);
    })
  }
}