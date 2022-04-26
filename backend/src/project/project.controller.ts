import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { FILE_ENDPOINT, PROJECT_ENDPOINT } from 'common/constants';
import { PostProjectDto, GetProjectDto } from 'common/dto/project.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'files/files.service';

@Controller(PROJECT_ENDPOINT)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  async getProjectsByQuery(
    @Query('query') query: string,
  ): Promise<GetProjectDto[]> {
    return this.projectService.findProjectsByQuery(query);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<GetProjectDto> {
    return this.projectService.findProjectById(id);
  }

  @Post(':id')
  async postProjectById(
    @Param('id') id: string,
    @Body() project: PostProjectDto,
  ) {
    return this.projectService.updateProject(id, project);
  }

  @Get(`:id/${FILE_ENDPOINT}`)
  async getFiles(@Param('id') id: string) {
    return this.filesService.getFilesByProject(id);
  }

  @Post(`:id/${FILE_ENDPOINT}`)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: string,
  ) {
    console.log(files);

    const filesSaved = await Promise.all(
      files.map(async (file) => {
        const fileBuf = file.buffer;
        return {
          name: file.fieldname ?? file.originalname,
          path: await this.filesService.saveFileToStorage(fileBuf),
        };
      }),
    );

    return this.filesService.insertFiles(id, filesSaved);
  }
}
