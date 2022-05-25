import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DeepPartial,
  FindCondition,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import SegmentTranslation from 'entities/segment-translation.entity';
import { PostTranslationDto } from 'dto/translate-piece.dto';
import { LanguageService } from 'modules/language/language.service';
import { Action } from 'entities/action.entity';
import { Suggestion } from 'entities/suggestion.entity';
import User from 'entities/user.entity';
import { SegmentStatus } from 'util/enums';
import { PagedResponseDto } from 'dto/response.dto';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(SegmentTranslation)
    private pieceRepository: Repository<SegmentTranslation>,
    // TODO: Replace with service
    private languageService: LanguageService,
  ) {}

  getFirstByFileAndLanguage(fileId: string, languageId: string) {
    return this.pieceRepository.findOne({
      where: {
        file: { id: fileId },
        translationLanguage: { id: languageId },
        order: 0,
      },
    });
  }

  getOne(id: string) {
    return this.pieceRepository.findOne(id);
  }

  getPieces(ids: string[]): Promise<SegmentTranslation[]> {
    return this.pieceRepository.findByIds(ids);
  }

  async getTranslationsByLanguage(params: {
    languageId: string;
    fileId?: string;
    take?: number;
    page?: number;
    shouldTranslate?: boolean;
    withOriginal?: boolean;
    status?: SegmentStatus;
    hasSuggestions?: string;
  }): Promise<PagedResponseDto<SegmentTranslation[]>> {
    const filter: FindCondition<SegmentTranslation> = {};

    if (params.languageId) {
      filter.translationLanguage = { id: Number(params.languageId) };
    }

    if (params.fileId) {
      filter.file = { id: Number(params.fileId) };
    }

    if (
      params.shouldTranslate !== null &&
      params.shouldTranslate !== undefined
    ) {
      filter.shouldTranslate = params.shouldTranslate;
    }

    if (params.status !== undefined && params.status !== null) {
      filter.status = params.status;
    }

    // if(params.hasSuggestions !== undefined && params.hasSuggestions !== null) {
    //   filter.suggestions = In([]);
    // }

    const query = this.pieceRepository
      .createQueryBuilder()
      .leftJoin(
        Suggestion,
        'suggestions',
        'SegmentTranslation.id = suggestions.segmentId',
      )
      .where(filter);

    const queryWithSuggestionFilter =
      params.hasSuggestions !== undefined && params.hasSuggestions !== null
        ? query.andWhere(
            `suggestions.id IS ${
              params.hasSuggestions === 'true' ? 'NOT' : ''
            } NULL`,
          )
        : query;

    console.log(typeof params.withOriginal);

    const [result, count] = await queryWithSuggestionFilter
      .take(params.take | 10)
      .skip(((params.page - 1) * (params.take | 10)) | 0)
      .getManyAndCount();

    // const [result, count] = await this.pieceRepository.findAndCount({
    //   take: params.take | 10,
    //   skip: ((params.page - 1) * (params.take | 10)) | 0,
    //   where: filter,
    //   order: { order: 'ASC' },
    //   // relations: ['suggestions']
    // });

    if (params.withOriginal && result.length > 0) {
      const project = await this.getProjectBySegment(result[0].id.toString());
      const languages =
        await this.languageService.getTranslationLanguagesByProjectId(
          project.id.toString(),
        );

      const originalLanguage = languages.find((l) => l.original);

      if (originalLanguage.id.toString() !== params.languageId) {
        const originalArray = await this.pieceRepository.find({
          where: {
            translationLanguage: { id: originalLanguage.id },
            order: In(result.map((s) => s.order)),
          },
        });
        return {
          data: originalArray.map((originalSegment) => ({
            ...result.find(
              (segment) => segment.order === originalSegment.order,
            ),
            original: originalSegment,
          })),
          meta: { totalReacords: count },
        };
      }
    }

    return { data: result, meta: { totalReacords: count } };
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

  async generateTranslationForFile(
    languageId: string,
    fileId: string,
    fromLanguageId: string,
  ) {
    let page = 1;
    let { data: currentBulk } = await this.getTranslationsByLanguage({
      languageId: fromLanguageId,
      fileId: fileId,
      take: 1000,
      page: page++,
    });

    console.log(`saving translations for ${languageId}`);

    while (currentBulk.length > 0) {
      const translations = currentBulk.reduce((previous, piece) => {
        if (piece.shouldTranslate) {
          const translation: DeepPartial<SegmentTranslation> = {};
          translation.translationLanguage = { id: Number(languageId) };
          translation.translationText = piece.translationText;
          translation.order = piece.order;
          translation.shouldTranslate = piece.shouldTranslate;
          translation.file = { id: Number(fileId) };

          return previous.concat(translation);
        }

        return previous;
      }, []);
      // const translations = currentBulk.map((piece) => {
      //   const translation: DeepPartial<SegmentTranslation> = {};
      //   translation.translationLanguage = { id: Number(languageId) };
      //   translation.translationText = piece.translationText;
      //   translation.order = piece.order;
      //   translation.shouldTranslate = piece.shouldTranslate;
      //   translation.file = { id: Number(fileId) }

      //   return translation;
      // });

      await this.pieceRepository
        .createQueryBuilder()
        .insert()
        .values(translations)
        .execute();

      const { data } = await this.getTranslationsByLanguage({
        languageId: fromLanguageId,
        fileId: fileId,
        take: 1000,
        page: page++,
      });
      currentBulk = data;
    }

    console.log('saved');
    return 'saved';
  }

  async removeSegmentsFromFile(fileId: number) {
    //await this.actionsRepository.delete({ segment: { file: { id: fileId } } });
    return this.pieceRepository.delete({ file: { id: fileId } });
  }

  async savePieces(pieces: PostTranslationDto[]) {
    return this.pieceRepository.save(pieces);
  }

  async getSegmentWithNeighbours(
    segmentId: string,
    params?: {
      prev?: number;
      next?: number;
      toLanguageId?: number;
      withOriginal?: boolean;
      include?: boolean;
    },
  ): Promise<(SegmentTranslation & { original?: SegmentTranslation })[]> {
    const segment = await this.pieceRepository.findOne(segmentId);

    if (!segment) {
      return [];
    }

    const filterLanguageId =
      params.toLanguageId ?? segment.translationLanguageId;
    const filter: FindCondition<SegmentTranslation> = {
      translationLanguage: { id: filterLanguageId },
      order: segment.order,
      file: { id: segment.fileId },
    };

    if (params.next && params.prev) {
      filter.order = Between(
        +filter.order - +params.prev,
        +filter.order + +params.next,
      );
    } else if (params.next) {
      filter.order = Between(
        +filter.order + 1 - (params.include ? 1 : 0),
        +filter.order + +params.next,
      );
    } else if (params.prev) {
      filter.order = Between(
        +filter.order - +params.prev,
        +filter.order - 1 + (params.include ? 1 : 0),
      );
    }

    const result = await this.pieceRepository.find({
      where: filter,
      order: { order: 'ASC' },
    });

    if (params.withOriginal) {
      const project = await this.getProjectBySegment(segmentId);
      const languages =
        await this.languageService.getTranslationLanguagesByProjectId(
          project.id.toString(),
        );
      const originalLanguage = languages.find((l) => l.original);

      if (originalLanguage.id !== filterLanguageId) {
        const originalArray = await this.pieceRepository.find({
          where: {
            ...filter,
            translationLanguage: { id: originalLanguage.id },
          },
          order: { order: 'ASC' },
        });
        return originalArray.map((originalSegment) => ({
          ...result.find((segment) => segment.order === originalSegment.order),
          original: originalSegment,
        }));
      }
    }

    return result;
  }

  async insertTextSegments(segments: DeepPartial<SegmentTranslation>[]) {
    const chunkSize = 1000;
    const arr: ObjectLiteral[] = [];
    for (let i = 0; i < segments.length; i += chunkSize) {
      const chunk = segments.slice(i, i + chunkSize);
      const { identifiers } = await this.pieceRepository
        .createQueryBuilder()
        .insert()
        .values(chunk)
        .execute();
      arr.push.apply(arr, identifiers);
      //arr = arr.concat(identifiers);
    }

    return arr;
  }

  async getTranslationsByOrder(languageId: string, orders: number[]) {
    return this.pieceRepository.find({
      where: { translationLanguage: languageId, order: In(orders) },
      order: { order: 'ASC' },
    });
  }

  async getProjectBySegment(segmentId: string) {
    return (
      await this.pieceRepository.findOne(segmentId, {
        relations: ['translationLanguage', 'translationLanguage.project'],
      })
    ).translationLanguage.project;
  }

  async getLanguageBySegment(segmentId: string) {
    return (
      await this.pieceRepository.findOne(segmentId, {
        relations: ['translationLanguage'],
      })
    ).translationLanguage;
  }

  async getOriginalBySegment(segmentId: string): Promise<SegmentTranslation> {
    const project = await this.getProjectBySegment(segmentId);
    const languages =
      await this.languageService.getTranslationLanguagesByProjectId(
        project.id.toString(),
      );
    const orig = languages.find((l) => l.original);
    const [originalSegment] = await this.getSegmentWithNeighbours(segmentId, {
      toLanguageId: orig.id,
    });
    return originalSegment;
  }

  async putTranslations(translations: PostTranslationDto[], user: User) {
    return Promise.all(
      translations.map(async (translation) => {
        const changeAction = new Action();
        changeAction.author = user;
        changeAction.change = translation.translationText;
        changeAction.comment = translation.comment;

        const segment = await this.pieceRepository.findOne(translation.id, {
          relations: ['actions'],
        });
        segment.actions.push(changeAction);
        segment.translationText = translation.translationText;
        segment.status = SegmentStatus.TRANSLATED;

        return this.pieceRepository.save(segment);
      }),
    );
  }

  async countSegmentsByProject(projectId: string) {
    return {
      all: await this.pieceRepository.count({
        relations: ['file', 'file.project'],
        where: { file: { project: { id: projectId } } },
      }),
      translated: await this.pieceRepository.count({
        relations: ['file', 'file.project'],

        where: {
          status: SegmentStatus.TRANSLATED,
          file: { project: { id: projectId } },
        },
      }),
    };
  }
  async countSegmentsByLanguage(languageId: string) {
    return {
      all: await this.pieceRepository.count({
        relations: ['translationLanguage'],
        where: { translationLanguage: { id: languageId } },
      }),
      translated: await this.pieceRepository.count({
        relations: ['translationLanguage'],
        where: {
          status: SegmentStatus.TRANSLATED,
          translationLanguage: { id: languageId },
        },
      }),
    };
  }

  async countSegmentsByFile(fileId: string) {
    return {
      all: await this.pieceRepository.count({
        relations: ['file'],
        where: { file: { id: fileId } },
      }),
      translated: await this.pieceRepository.count({
        relations: ['file'],
        where: {
          status: SegmentStatus.TRANSLATED,
          file: { id: fileId },
        },
      }),
    };
  }

  async updateStatus(segmentId: string, status: SegmentStatus) {
    return this.pieceRepository.update(segmentId, { status: status });
  }
}
