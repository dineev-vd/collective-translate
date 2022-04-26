import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import SegmentTranslation from 'entities/segment-translation.entity';
import { PostTranslationDto } from 'common/dto/translate-piece.dto';
import { TextSegmentService } from 'text-segment/text-segment.service';
import { LanguageService } from 'language/language.service';
import { ActionsService } from 'actions/actions.service';
import { Action } from 'entities/action.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(SegmentTranslation)
    private pieceRepository: Repository<SegmentTranslation>,
    private readonly textSegmentService: TextSegmentService,
    private readonly landuageService: LanguageService,
    @InjectRepository(Action)
    private readonly actionsRepository: Repository<Action>
  ) { }

  getPiece(id: string): Promise<SegmentTranslation> {
    return this.pieceRepository.findOne(id, {
      relations: ['actions', 'actions.author', 'textSegment'],
    });
  }

  getPieces(ids: string[]): Promise<SegmentTranslation[]> {
    return this.pieceRepository.findByIds(ids);
  }

  getTranslationsByLanguage(languageId: string, fileId?: string) {
    if (fileId) {
      return this.pieceRepository.find({
        relations: ['textSegment'],
        take: 10,
        skip: 0,
        where: {
          translationLanguage: { id: languageId },
          textSegment: { file: { id: fileId } },
        },
      });
    }

    return this.pieceRepository.find({
      take: 10,
      skip: 0,
      where: {
        translationLanguage: { id: languageId },
      },
    });
  }

  getTranslationsByTextSegmentsAndLanguage(
    textSegmentsIds: string[],
    languageId: string,
  ) {
    return this.pieceRepository.find({
      where: {
        textSegment: { id: In(textSegmentsIds) },
        translationLanguage: { id: languageId },
      },
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

  async generateTranslationForFile(id: string, fileId: string) {
    const language = await this.landuageService.getTranslationLanguageById(id);
    const textPieces = await this.textSegmentService.getSegmentsForTranslation(
      fileId,
    );
    const translations = textPieces.map((piece) => {
      const translation = new SegmentTranslation();
      translation.textSegment = piece;
      // translation.translationLanguage = language;

      return translation;
    });
    console.log(`saving translations for ${language.language}`);

    const { identifiers } = await this.pieceRepository.insert(translations);
    console.log('inserted');

    await this.pieceRepository
      .createQueryBuilder()
      .relation('translationLanguage')
      .of(identifiers)
      .set(language);
    console.log('language set');

    await Promise.all(
      identifiers.map(async (i, index) => {
        return this.pieceRepository
          .createQueryBuilder()
          .relation('textSegment')
          .of(i)
          .set(translations[index].textSegment)
      }),
    );

    console.log('relations set');
    

    const actions = identifiers.map(i => {
      const action = new Action();
      action.comment = 'Перевод создан';
      action.change = '';
      return action;
    })

    const { identifiers: actionIds } = await this.actionsRepository.insert(actions);
    console.log('actions inserted');
    
    await this.landuageService.setActionsRelations(language.id.toString(), identifiers)
    console.log('actions language set');

    await Promise.all(actionIds.map((i, index) => {
      return this.actionsRepository.createQueryBuilder()
      .relation('segment')
      .of(i)
      .set(textPieces[index].id)
    }))

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
}
