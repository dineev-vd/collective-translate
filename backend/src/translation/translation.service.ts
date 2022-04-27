import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, DeepPartial, In, Repository } from 'typeorm';
import SegmentTranslation from 'entities/segment-translation.entity';
import { PostTranslationDto } from 'common/dto/translate-piece.dto';
import { LanguageService } from 'language/language.service';
import { Action } from 'entities/action.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(SegmentTranslation)
    private pieceRepository: Repository<SegmentTranslation>,
    private readonly landuageService: LanguageService,
    @InjectRepository(Action)
    private readonly actionsRepository: Repository<Action>,
  ) { }

  getPiece(id: string): Promise<SegmentTranslation> {
    return this.pieceRepository.findOne(id);
  }

  getPieces(ids: string[]): Promise<SegmentTranslation[]> {
    return this.pieceRepository.findByIds(ids);
  }

  getTranslationsByProject(params: { projectId: string, languageId?: string, fileId?: string, take?: number, page?: number }) {
    const filter: DeepPartial<SegmentTranslation> = {}

    if (params.languageId) {
      filter.translationLanguage.id = Number(params.languageId);
    }

    if (params.fileId) {
      filter.file.id = Number(params.fileId);
    }

    filter.file.project.id = Number(params.projectId);

    return this.pieceRepository.find({
      take: params.take | 10,
      skip: (params.page - 1) * (params.take | 10) | 0,
      where: filter
    });
  }

  updatePieces(pieces: { piece: PostTranslationDto; id: string }[]) {
    return pieces.map((piece) => {
      if (piece.piece.translationText) {
        return this.pieceRepository.update(piece.id, {
          translationText: piece.piece.translationText,
        });
      } else {
      }
    });
  }

  async savePiece(piece: SegmentTranslation) {
    return this.pieceRepository.save(piece);
  }

  async generateTranslationForFile(languageId: string, fileId: string) {
    const language = await this.landuageService.getTranslationLanguageById(languageId);
    const translations = textPieces.map((piece) => {
      const translation = new SegmentTranslation();
      translation.textSegment = piece;
      translation.translationLanguage = language;

      return translation;
    });
    console.log(`saving translations for ${language.language}`);

    await this.pieceRepository.createQueryBuilder().insert().values(translations).execute();


    //const { identifiers } = await this.pieceRepository.insert(translations);
    console.log('inserted');

    // await this.pieceRepository
    //   .createQueryBuilder()
    //   .relation('translationLanguage')
    //   .of(identifiers)
    //   .set(language);
    // console.log('language set');

    // await Promise.all(
    //   identifiers.map(async (i, index) => {
    //     return this.pieceRepository
    //       .createQueryBuilder()
    //       .relation('textSegment')
    //       .of(i)
    //       .set(translations[index].textSegment);
    //   }),
    // );

    console.log('relations set');

    const actions = textPieces.map((i, index) => {
      const action = new Action();
      action.comment = 'Перевод создан';
      action.change = '';
      action.segment = textPieces[index];
      action.language = language;
      return action;
    });

    // const { identifiers: actionIds } = await this.actionsRepository.insert(
    //   actions,
    // );


    const chunkSize = 1000;
    for (let i = 0; i < actions.length; i += chunkSize) {
      const chunk = actions.slice(i, i + chunkSize);
      await this.actionsRepository.createQueryBuilder().insert().values(chunk).execute()
    }

    console.log('actions inserted');

    // await this.landuageService.setActionsRelations(
    //   language.id.toString(),
    //   actionIds,
    // );
    console.log('actions language set');

    // await Promise.all(
    //   actionIds.map((i, index) => {
    //     return this.actionsRepository
    //       .createQueryBuilder()
    //       .relation('segment')
    //       .of(i)
    //       .set(textPieces[index].id);
    //   }),
    // );

    console.log('translations actions set');

    //await this.pieceRepository.save(identifiers.map((id, i) => ({ id: id, ...(translations[i]) })));

    // const saved = await this.pieceRepository.save(translations, { chunk: 100 });
    console.log('saved');
  }

  // async updatePiece(id: string, user: User, piece: PostTranslatePieceDto) {
  //     const pieceFromDb = await this.getPiece(id);
  //     if (piece.after) {
  //         const afterChange = new Action()
  //         afterChange.author = user;
  //         afterChange.change = piece.after;
  //         afterChange.segment = pieceFromDb;
  //         await this.pieceEditRepository.insert(afterChange);
  //     }

  //     if (piece.after) {
  //         const beforeChange = new Action()
  //         beforeChange.author = user;
  //         beforeChange.change = piece.before;
  //         beforeChange.segment = pieceFromDb;
  //         await this.pieceEditRepository.insert(beforeChange);
  //     }

  //     return this.pieceRepository.update(id, piece);
  // }

  async removeSegmentsFromFile(fileId: number) {
    return this.testSegmentRepository.delete({ file: { id: fileId } });
  }

  async savePieces(pieces: PostTextSegmentDto[]) {
    return this.testSegmentRepository.save(pieces);
  }

  async getPiece(id: number) {
    return this.testSegmentRepository.findOne({ where: { id: id } });
  }

  async getSegmentsByProject(
    projectId: string,
    take?: number,
    page?: number,
    shouldTranslate = true,
  ) {
    return this.testSegmentRepository.find({
      where: {
        file: { project: { id: projectId } },
        shouldTranslate: shouldTranslate,
      },
      take: take || 10,
      skip: (page - 1) * take || 0,
      relations: ['file'],
    });
  }

  async getPiecesByFile(
    fileId: string,
    take?: number,
    page?: number,
    shouldTranslate = true,
  ) {
    return this.testSegmentRepository.find({
      take: take || 10,
      skip: (page - 1) * take || 0,
      where: { file: { id: fileId }, shouldTranslate: shouldTranslate },
    });
  }

  async getPrev(segment: TextSegment, amount: number) {
    const prev = await this.testSegmentRepository.find({
      take: amount,
      order: { order: 'DESC' },
      where: { order: LessThan(segment.order) },
    });

    return prev.reverse();
  }

  async getNext(segment: TextSegment, amount: number) {
    return this.testSegmentRepository.find({
      take: amount,
      order: { order: 'ASC' },
      where: { order: MoreThan(segment.order) },
    });
  }

  async getBatch(fileId: string, skip: number, take: number) {
    return this.testSegmentRepository.find({
      take: take,
      skip: skip,
      order: { order: 'ASC' },
      where: { file: { id: fileId } },
    });
  }

  async getFirstTextSegment(fileId: string) {
    return this.testSegmentRepository.findOne({
      where: { previous: IsNull(), file: { id: fileId } },
    });
  }

  async getSegmentsForTranslation(fileId: string) {
    return this.testSegmentRepository.find({
      where: { file: { id: fileId }, shouldTranslate: true },
    });
  }

  async insertTextSegments(segments: TextSegment[]) {

    const chunkSize = 1000;
    let arr: ObjectLiteral[] = [];
    for (let i = 0; i < segments.length; i += chunkSize) {
      const chunk = segments.slice(i, i + chunkSize);
      const { identifiers } = await this.testSegmentRepository.createQueryBuilder().insert().values(chunk).execute()
      arr = arr.concat(identifiers);
    }

    return arr;
  }
}
