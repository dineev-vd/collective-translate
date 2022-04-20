import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository, UpdateResult } from "typeorm";
import SegmentTranslation from "entities/segment-translation.entity";
import { isRegExp } from "util/types";
import { runInThisContext } from "vm";
import { ChangeType, Action } from "entities/action.entity";
import { PostTranslatePieceDto } from "common/dto/translate-piece.dto";
import User from "entities/user.entity";

@Injectable()
export class PieceService {
    constructor(
        @InjectRepository(SegmentTranslation)
        private pieceRepository: Repository<SegmentTranslation>,
        @InjectRepository(Action)
        private pieceEditRepository: Repository<Action>
    ) { }


    getPiece(id: string): Promise<SegmentTranslation> {
        return this.pieceRepository.findOne(id, { relations: ["history", "history.author"] });
    }

    getPieces(ids: string[]): Promise<SegmentTranslation[]> {
        return this.pieceRepository.findByIds(ids);
    }

    getTranslationsByLanguage(projectId: string) {
        return this.pieceRepository.find({ where: { translationLanguage: { id: projectId } } })
    }

    updatePieces(id: string, pieces: Partial<SegmentTranslation>[]) {
        return this.pieceRepository.save(pieces.map(piece => ({ ...piece, project: { id: Number(id) } })));
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