import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'entities/file.entity';
import { DeepPartial, Repository } from 'typeorm';
import { createReadStream } from 'fs';
import * as chardet from 'chardet';
import * as iconv from 'iconv-lite';
import { TextSegment } from 'entities/text-segment.entity';
import * as fs from 'fs/promises';
import { FileStatus } from 'common/enums';
import * as crypto from 'crypto';
import { Assembly } from 'entities/assembly.entity';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { ActionsService } from 'actions/actions.service';
import { Action } from 'entities/action.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Assembly)
    private readonly assemblyRepository: Repository<Assembly>,
    private readonly textSegmentService: TextSegmentService,
    private readonly actionsService: ActionsService
  ) { }

  async getFileById(id: string) {
    return this.fileRepository.findOne(id);
  }

  async saveFileToStorage(buffer: Buffer) {
    const fileName = crypto.randomUUID();
    await fs.writeFile(fileName, buffer);
    return fileName;
  }

  async insertFiles(
    projectId: string,
    filePaths: { name: string; path: string }[],
  ) {
    const files = await Promise.all(
      filePaths.map(async (path) => {
        const file: DeepPartial<File> = {};
        const encoding = (await chardet.detectFile(path.path)).toString();
        file.name = path.name ?? 'Без названия';
        file.path = path.path;
        file.encoding = encoding;
        file.project = {
          id: Number(projectId),
        };

        return file;
      }),
    );

    return this.fileRepository.save(files);
  }

  async peekFileById(id: string, charsFromStart: number) {
    const file = await this.fileRepository.findOne(id);
    const stream = createReadStream(file.path, {
      start: 0,
      end: charsFromStart,
    });
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const fileString = iconv.decode(buffer, file.encoding);

    return { text: fileString };
  }

  async formTextSegments(
    re: RegExp,
    completeText: string,
  ): Promise<TextSegment[]> {
    let count = 0;
    const array = completeText
      .split(re)
      .reduce((previous, splitPart, index) => {
        if (splitPart.length === 0) return previous;

        const textSegment = new TextSegment();
        textSegment.shouldTranslate = index % 2 !== 0;
        textSegment.text = splitPart;
        textSegment.order = count++;

        return [...previous, textSegment];
      }, []);

    return array;
  }

  async getFilesByProject(projectId: string) {
    return this.fileRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async createAssembly(file: File, filePath: string) {
    const assembly = new Assembly();
    assembly.path = filePath;
    assembly.file = file;
    assembly.name = file.name + ' assembly';
    return this.assemblyRepository.save(assembly);
  }

  async splitFile(id: string) {
    const file = await this.fileRepository.findOne(id);
    await this.fileRepository.save({
      id: Number(id),
      status: FileStatus.PROCESSING,
    });

    try {
      console.log('started');
      const fileBuffer = await fs.readFile(file.path);
      console.log('fileRead');
      const decoded = iconv.decode(fileBuffer, file.encoding);
      console.log('fileDecoded');

      const reg = /(\s+[^.!?]*[.!?])/g;
      const segments = await this.formTextSegments(reg, decoded);
      const actions = segments.map(s => {
        const action = new Action();
        action.change = '';
        action.comment = 'Сегмент создан';

        return action;
      });

      console.log('fileSplit');
      const { identifiers: actionIds } = await this.actionsService.insertActions(actions);
      console.log('actions inserted');


      // this should be fast as fuck
      const { identifiers } = await this.textSegmentService.insertTextSegments(
        segments,
      );
      await this.fileRepository
        .createQueryBuilder()
        .relation('textSegments')
        .of(file)
        .add(identifiers);

      console.log('file relations set');
      await this.actionsService.setSegmentRelations(actionIds, identifiers);
      console.log('actions relations set');
      

      // await this.fileRepository.save({ id: Number(id), textSegments: segments, status: FileStatus.SPLITTED }, { chunk: 100 });
      console.log('text segments saved');
    } catch (e) {
      console.log(e);
      await this.fileRepository.save({
        id: Number(id),
        status: FileStatus.NEW,
      });
    }
  }
}
