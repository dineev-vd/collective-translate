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
    @InjectRepository(Action)
    private readonly actionsRepository: Repository<Action>,
  ) { }

  getPieces(ids: string[]): Promise<SegmentTranslation[]> {
    return this.pieceRepository.findByIds(ids);
  }

  getTranslationsByProject(params: { languageId: string, fileId?: string, take?: number, page?: number, shouldTranslate?: Boolean }) {
    const filter: DeepPartial<SegmentTranslation> = {}

    if (params.languageId) {
      filter.translationLanguage.id = Number(params.languageId);
    }

    if (params.fileId) {
      filter.file.id = Number(params.fileId);
    }

    if (params.shouldTranslate !== null) {
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

  async savePiece(piece: SegmentTranslation) {
    return this.pieceRepository.save(piece);
  }


  async generateTranslationForFile(languageId: string, fileId: string, fromLanguageId: string) {
    let currentBulk = await this.getTranslationsByProject({ languageId: fromLanguageId, fileId: fileId, take: 1000 });

    console.log(`saving translations for ${languageId}`);

    while (currentBulk.length > 0) {
      const translations = currentBulk.map((piece) => {
        const translation: DeepPartial<SegmentTranslation> = {};
        translation.translationLanguage = { id: Number(languageId) };
        translation.translationText = piece.translationText;
        translation.order = piece.order;
        translation.shouldTranslate = piece.shouldTranslate;

        return translation;
      });

      await this.pieceRepository.createQueryBuilder().insert().values(translations).execute();
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

  async getSegmentWithNeighbours(segmentId: string, params?: { prev?: number, next?: number }) {
    const segment = await this.pieceRepository.findOne(segmentId);

    const filter: FindCondition<SegmentTranslation> = {};

    if (params.next && params.prev) {
      filter.order = Between(segment.order - params.prev, segment.order + params.next);
      return this.pieceRepository.find(filter);
    }

    if (params.next) {
      filter.order = Between(segment.order, segment.order + params.next);
      return this.pieceRepository.find(filter);
    }

    if (params.prev) {
      filter.order = Between(segment.order - params.prev, segment.order);
      return this.pieceRepository.find(filter);
    }

    return [segment];
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

  async generateTextSegments() {

  }
}
