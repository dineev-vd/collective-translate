import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository, UpdateResult } from 'typeorm';
import SegmentTranslation from 'entities/segment-translation.entity';
import { isRegExp } from 'util/types';
import { runInThisContext } from 'vm';
import { ChangeType, Action } from 'entities/action.entity';
import { PostTranslationDto } from 'common/dto/translate-piece.dto';
import User from 'entities/user.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(SegmentTranslation)
    private pieceRepository: Repository<SegmentTranslation>,
    @InjectRepository(Action)
    private pieceEditRepository: Repository<Action>,
  ) { }

  getPiece(id: string): Promise<SegmentTranslation> {
    return this.pieceRepository.findOne(id, {
      relations: ['actions', 'actions.author', 'textSegment'],
    });
  }

  getPieces(ids: string[]): Promise<SegmentTranslation[]> {
    return this.pieceRepository.findByIds(ids);
  }

  getTranslationsByLanguage(projectId: string) {
    return this.pieceRepository.find({
      where: { translationLanguage: { id: projectId } },
    });
  }

  getTranslationsByTextSegmentsAndLanguage(textSegmentsIds: string[], languageId: string) {
    return this.pieceRepository.find({
      where: { textSegment: { id: In(textSegmentsIds) }, translationLanguage: { id: languageId } }
    })
  }

  updatePieces(pieces: { piece: PostTranslationDto, id: string }[]) {
    return pieces.map(piece => {
      if (piece.piece.translationText) {
        return this.pieceRepository.update(piece.id, { translationText: piece.piece.translationText });
      } else {
        
      }
    })
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
