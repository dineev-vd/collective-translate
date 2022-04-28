import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  FILE_ENDPOINT,
  LANGUAGE_ENDPOINT,
  PROJECT_ENDPOINT,
  TEXT_SEGMENT_ENDPOINT,
} from 'common/constants';
import { PostProjectDto, GetProjectDto } from 'common/dto/project.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'files/files.service';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { LanguageService } from 'language/language.service';
import { PostTranslateLanguage } from 'common/dto/language.dto';
import { TranslationService } from 'translation/translation.service';

@Controller(PROJECT_ENDPOINT)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly filesService: FilesService,
    private readonly languageService: LanguageService,
    private readonly translationsService: TranslationService,
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

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async insertProject(
    @Body() project: PostProjectDto,
    @Req() { user }: ExtendedRequest,
  ) {
    return this.projectService.createProject({ ...project, owner: user });
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

  @Get(`:id/${LANGUAGE_ENDPOINT}`)
  async getProjectLanguages(@Param('id') projectId: string) {
    return this.languageService.getTranslationLanguagesByProjectId(projectId);
  }

  @Post(`:id/${LANGUAGE_ENDPOINT}`)
  async createTranslation(
    @Param('id') id: string,
    @Body() language: PostTranslateLanguage,
  ) {
    const process = async () => {
      const originalLanguage = await this.languageService.getOriginalLanguage(id);
      const createdLanguage = await this.languageService.saveLanguage({
        ...language,
        project: { id: Number(id) },
      });
      const files = await this.filesService.getFilesByProject(id);
      await Promise.all(
        files.map((file) =>
          this.translationsService.generateTranslationForFile(
            createdLanguage.id.toString(),
            file.id.toString(),
            originalLanguage.id.toString()
          ),
        ),
      );
    };

    process();
    return 'OK';
  }
}
