import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { FILE_ENDPOINT, PROJECT_ENDPOINT } from 'common/constants';
import { PostProjectDto, GetProjectDto } from 'common/dto/project.dto';
import { TranslationService } from 'translation/translation.service';

@Controller(PROJECT_ENDPOINT)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private translatePieceService: TranslationService,
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

  // @Post(`:id/${FILE_ENDPOINT}`)
  // @UseInterceptors(AnyFilesInterceptor())
  // async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Param('id') id: string) {
  //   const project = await this.projectService.findProjectById(id);
  //   files.forEach((file) => {
  //     const fileBuf = file.buffer;
  //     const analyzed = chardet.analyse(fileBuf);
  //     const fileString = iconv.decode(fileBuf, analyzed[0].name);
  //     this.projectService.
  //   })
  // }

  @Get(`:id/translate-pieces`)
  async getTranslatePieces(@Param('id') id: string) {
    return this.translatePieceService.getTranslationsByLanguage(id);
  }
}
