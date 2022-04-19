import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import chardet from "chardet";
import * as iconv from "iconv-lite";
import { TextpieceService } from "TextPiece/TextPiece.service";
import { FILE_ENDPOINT, PROJECT_ENDPOINT } from "common/constants";
import { PostProjectDto, GetProjectDto } from "common/dto/project.dto";


@Controller(PROJECT_ENDPOINT)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private textpieceService: TextpieceService
  ) { }

  @Get()
  async getProjectsByQuery(@Query('query') query: string): Promise<GetProjectDto[]> {
    return (await this.projectService.findProjectsByQuery(query))
      .map(projectEntity => projectEntity.toDataTransferObject());
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<GetProjectDto> {
    return (await this.projectService.findProjectById(id))
      .toDataTransferObject();
  }

  @Post(':id')
  async postProjectById(@Param('id') id: string, @Body() project: PostProjectDto) {
    return this.projectService.updateProject(id, project);
  }

  @Post(`:id/${FILE_ENDPOINT}`)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Param('id') id: string) {
    const project = await this.projectService.findProjectById(id);
    files.forEach((file) => {
      const fileBuf = file.buffer;
      const analyzed = chardet.analyse(fileBuf);
      const fileString = iconv.decode(fileBuf, analyzed[0].name);
      this.textpieceService.splitText(project, fileString);
    })
  }
}