import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Between, DeepPartial, FindCondition, In, ObjectLiteral, Repository } from 'typeorm';
import SegmentTranslation from 'entities/segment-translation.entity';
import { PostTranslationDto } from 'common/dto/translate-piece.dto';
import { LanguageService } from 'language/language.service';
import { Action } from 'entities/action.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(SegmentTranslation)
    private pieceRepository: Repository<SegmentTranslation>,
    // TODO: Replace with service
    private languageService: LanguageService
  ) { }

  getOne(id: string) {
    return this.pieceRepository.findOne(id);
  }

  getPieces(ids: string[]): Promise<SegmentTranslation[]> {
    return this.pieceRepository.findByIds(ids);
  }

  getTranslationsByProject(params: { languageId: string, fileId?: string, take?: number, page?: number, shouldTranslate?: Boolean }) {
    const filter: DeepPartial<SegmentTranslation> = {}

    if (params.languageId) {
      filter.translationLanguage = { id: Number(params.languageId) };
    }

    if (params.fileId) {
      filter.file = { id: Number(params.fileId) };
    }

    if (params.shouldTranslate !== null && params.shouldTranslate !== undefined) {
      filter.shouldTranslate = params.shouldTranslate;
    }

    //filter.file.project.id = Number(params.projectId);

    return this.pieceRepository.find({
      take: params.take | 10,
      skip: (params.page - 1) * (params.take | 10) | 0,
      where: filter,
      order: { order: 'ASC' }
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

  async savePiece(piece: Partial<SegmentTranslation>) {
    return this.pieceRepository.save(piece);
  }


  async generateTranslationForFile(languageId: string, fileId: string, fromLanguageId: string) {
    let page = 1;
    let currentBulk = await this.getTranslationsByProject({ languageId: fromLanguageId, fileId: fileId, take: 1000, page: page++ });

    console.log(`saving translations for ${languageId}`);

    while (currentBulk.length > 0) {

      const translations = currentBulk.reduce((previous, piece) => {
        if (piece.shouldTranslate) {
          const translation: DeepPartial<SegmentTranslation> = {};
          translation.translationLanguage = { id: Number(languageId) };
          translation.translationText = piece.translationText;
          translation.order = piece.order;
          translation.shouldTranslate = piece.shouldTranslate;
          translation.file = { id: Number(fileId) }

          return previous.concat(translation);
        }

        return previous;
      }, [])
      // const translations = currentBulk.map((piece) => {
      //   const translation: DeepPartial<SegmentTranslation> = {};
      //   translation.translationLanguage = { id: Number(languageId) };
      //   translation.translationText = piece.translationText;
      //   translation.order = piece.order;
      //   translation.shouldTranslate = piece.shouldTranslate;
      //   translation.file = { id: Number(fileId) }

      //   return translation;
      // });

      await this.pieceRepository.createQueryBuilder().insert().values(translations).execute();
      currentBulk = await this.getTranslationsByProject({ languageId: fromLanguageId, fileId: fileId, take: 1000, page: page++ });
    }

    console.log('saved');
  }


  async removeSegmentsFromFile(fileId: number) {
    //await this.actionsRepository.delete({ segment: { file: { id: fileId } } });
    return this.pieceRepository.delete({ file: { id: fileId } });
  }

  async savePieces(pieces: PostTranslationDto[]) {
    return this.pieceRepository.save(pieces);
  }

  async getSegmentWithNeighbours(id: string, params?: { prev?: number, next?: number, toLanguageId?: number, withOriginal?: Boolean }) {
    const segment = await this.pieceRepository.findOne(id);

    if (!segment) {
      return [];
    }

    const filter: FindCondition<SegmentTranslation> = { translationLanguage: { id: params.toLanguageId ?? segment.translationLanguageId }, order: segment.order, file: { id: segment.fileId } };

    if (params.next && params.prev) {
      filter.order = Between(+filter.order - +params.prev, +filter.order + +params.next);
    } else if (params.next) {
      filter.order = Between(+filter.order, +filter.order + +params.next);
    } else if (params.prev) {
      filter.order = Between(+filter.order - +params.prev, +filter.order);
    }

    const result = await this.pieceRepository.find({ where: filter });

    if (params.withOriginal) {
      const original = await this.getOriginalBySegment(id);
      return result.map(segment => ({ ...segment, original: original }))
    }

    return this.pieceRepository.find({ where: filter });
  }

  async insertTextSegments(segments: DeepPartial<SegmentTranslation>[]) {
    const chunkSize = 1000;
    let arr: ObjectLiteral[] = [];
    for (let i = 0; i < segments.length; i += chunkSize) {
      const chunk = segments.slice(i, i + chunkSize);
      const { identifiers } = await this.pieceRepository.createQueryBuilder().insert().values(chunk).execute();
      arr.push.apply(arr, identifiers)
      //arr = arr.concat(identifiers);
    }

    return arr;
  }

  async getTranslationsByOrder(languageId: string, orders: number[]) {
    return this.pieceRepository.find({ where: { translationLanguage: languageId, order: In(orders) }, order: { order: "ASC" } })
  }

  async getProjectBySegment(segmentId: string) {
    return (await this.pieceRepository.findOne(segmentId, { relations: ['translationLanguage', 'translationLanguage.project'] })).translationLanguage.project;
  }

  async getLanguageBySegment(segmentId: string) {
    return (await this.pieceRepository.findOne(segmentId, { relations: ['translationLanguage'] })).translationLanguage;
  }

  async getOriginalBySegment(segmentId: string) {
    const project = await this.getProjectBySegment(segmentId);
    return this.languageService.getTranslationLanguagesByProjectId(project.id.toString());
  }
}
