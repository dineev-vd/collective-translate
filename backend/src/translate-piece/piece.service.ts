import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository, UpdateResult } from "typeorm";
import TranslatePiece from "entities/TranslatePiece.entity";
import { isRegExp } from "util/types";
import { runInThisContext } from "vm";
import { ChangeType, TranslatePieceEdit } from "entities/TranslatePieceEdit.entity";
import { PostTranslatePieceDto } from "common/dto/translate-piece.dto";
import User from "entities/User.entity";

@Injectable()
export class PieceService {
    constructor(
        @InjectRepository(TranslatePiece)
        private pieceRepository: Repository<TranslatePiece>,
        @InjectRepository(TranslatePieceEdit)
        private pieceEditRepository: Repository<TranslatePieceEdit>
    ) { }


    getPiece(id: string): Promise<TranslatePiece> {
        return this.pieceRepository.findOne(id, {relations: ["history", "history.author"]});
    }

    getPieces(ids: string[]): Promise<TranslatePiece[]> {
        return this.pieceRepository.findByIds(ids);
    }

    getPiecesByProject(projectId: string): Promise<TranslatePiece[]> {
        return this.pieceRepository.find({ where: { project: projectId } })
    }

    updatePieces(id: string, pieces: Partial<TranslatePiece>[]) {
        return this.pieceRepository.save(pieces.map(piece => ({ ...piece, project: { id: Number(id) } })));
    }

    async updatePiece(id: string, user: User, piece: PostTranslatePieceDto) {
        const pieceFromDb = await this.getPiece(id);
        if(piece.after) {
            const afterChange = new TranslatePieceEdit()
            afterChange.changeType = ChangeType.AFTER;
            afterChange.author = user;
            afterChange.change = piece.after;
            afterChange.owner = pieceFromDb;
            await this.pieceEditRepository.insert(afterChange);
        }

        if(piece.after) {
            const beforeChange = new TranslatePieceEdit()
            beforeChange.changeType = ChangeType.BEFORE;
            beforeChange.author = user;
            beforeChange.change = piece.before;
            beforeChange.owner = pieceFromDb;
            await this.pieceEditRepository.insert(beforeChange);
        }

        return this.pieceRepository.update(id, piece);
    }

}