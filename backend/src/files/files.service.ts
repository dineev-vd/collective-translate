import { forwardRef, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'entities/file.entity';
import { DeepPartial, Repository } from 'typeorm';
import { createReadStream } from 'fs';
import * as chardet from 'chardet';
import * as iconv from 'iconv-lite';
import * as fs from 'fs/promises';
import { FileStatus } from 'common/enums';
import * as crypto from 'crypto';
import { Assembly } from 'entities/assembly.entity';
import { ActionsService } from 'actions/actions.service';
import { Action } from 'entities/action.entity';
import { TranslationService } from 'translation/translation.service';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { LanguageService } from 'language/language.service';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Language } from 'entities/language.entity';
import * as sbd from "sbd";
import { RegularExpression } from 'entities/regexp.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Assembly)
    private readonly assemblyRepository: Repository<Assembly>,
    private readonly actionsService: ActionsService,
    private readonly translationsService: TranslationService,
    private readonly languageService: LanguageService,
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

  async peekFileById(id: string, charsFromStart: number, regexp?: string) {
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
    const re = regexp ? new RegExp(`${decodeURI(regexp)}`, 'g') : /(.*)/g;

    return { text: fileString.split(re).map((value, index) => ({ marked: index % 2 !== 0, text: value })).filter(t => t.text.length > 0) };
  }

  async getFirstSegment(fileId: string) {
    const file = await this.fileRepository.findOne(fileId);
    const languages = await this.languageService.getTranslationLanguagesByProjectId(file.projectId.toString());
    const originalLanguage = languages.find(l => l.original);

    return this.translationsService.getFirstByFileAndLanguage(file.id.toString(), originalLanguage.id.toString());
  }

  async formTextSegments(
    re: RegExp,
    completeText: string,
    file: File,
    original: TranslationLanguage
  ): Promise<SegmentTranslation[]> {
    let count = 0;
    sbd.sentences(completeText, {})
    const array = completeText
      .split(re)
      .reduce((previous, splitPart, index) => {
        if (splitPart.length === 0) return previous;
        sbd
        const textSegment = new SegmentTranslation();
        textSegment.shouldTranslate = index % 2 !== 0;
        textSegment.translationText = splitPart;
        textSegment.order = count++;
        textSegment.file = file;
        textSegment.translationLanguage = original;

        return [...previous, textSegment];
      }, []);

    return array;
  }

  async getFilesByProject(projectId: string) {
    return this.fileRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async assembleFile(id: string, languageId: string) {
    const file = await this.getFileById(id);
    const bulkSize = 1000;
    let offset = 1;
    const params = { languageId: languageId, fileId: id, take: bulkSize };

    const first = await this.getFirstSegment(id);

    let currentBulk = await this.translationsService.getSegmentWithNeighbours(first.id.toString(), { next: bulkSize * offset, toLanguageId: +languageId, withOriginal: true, include: true })

    const fileName = crypto.randomUUID();
    const fileWrite = await fs.open(fileName, 'a+');


    while (currentBulk.length > 0) {
      const stringToWrite = currentBulk
        .map((segment) => {
          if(segment.id) {
            return segment.translationText;
          }

          return segment.original.translationText;
        })
        .join('');

      await fileWrite.appendFile(iconv.encode(stringToWrite, file.encoding));

      currentBulk = await this.translationsService.getSegmentWithNeighbours(currentBulk[currentBulk.length - 1].id ? currentBulk[currentBulk.length - 1].id.toString() : currentBulk[currentBulk.length - 1].original.id.toString(), { next: bulkSize * offset, toLanguageId: +languageId, withOriginal: true })
    }

    await fileWrite.close();

    const language = await this.languageService.getTranslationLanguageById(
      languageId,
    );
    return this.createAssembly(file, fileName, language);
  }

  async createAssembly(
    file: File,
    filePath: string,
    language: TranslationLanguage,
  ) {
    const assembly = new Assembly();
    assembly.path = filePath;
    assembly.language = language;
    assembly.name = file.name + ' assembly';
    return this.assemblyRepository.save(assembly);
  }

  async splitFile(id: string, regexp?: string) {
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

      const reg = regexp ? new RegExp(`${decodeURI(regexp)}`, 'g') : /(\s+[^.!?]*[.!?])/g;
      await this.translationsService.removeSegmentsFromFile(file.id);

      const original = (await this.languageService.getOriginalLanguage(file.projectId.toString()));

      const segments = await this.formTextSegments(reg, decoded, file, original);
      // this should be fast as fuck
      const identifiers = await this.translationsService.insertTextSegments(segments);
      //console.log(identifiers)

      const actions = identifiers.map((i) => {
        const action: DeepPartial<Action> = {};
        action.change = '';
        action.comment = 'Сегмент создан';
        action.segment = { id: Number(i.id) };

        return action;
      });

      console.log('fileSplit');
      await this.actionsService.insertActions(actions);
      console.log('actions inserted');

      await this.fileRepository.update(Number(id), { status: FileStatus.SPLITTED });
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
