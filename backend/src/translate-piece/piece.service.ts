import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository, UpdateResult } from "typeorm";
import TranslatePiece from "entities/TranslatePiece.entity";
import { isRegExp } from "util/types";
import { runInThisContext } from "vm";

@Injectable()
export class PieceService {
    constructor(
        @InjectRepository(TranslatePiece)
        private pieceRepository: Repository<TranslatePiece>
    ) { }


    getPiece(id: string, projectId: string): Promise<TranslatePiece> {
        return this.pieceRepository.findOne({ where: { id: id, project: { id: projectId } } });
    }

    getPiecesByProject(projectId: string): Promise<TranslatePiece[]> {
        return this.pieceRepository.find({ where: { project: projectId } })
    }

    updatePiece(id: string, pieces: Partial<TranslatePiece>[]) {
        return this.pieceRepository.save(pieces.map(piece => ({ ...piece, project: { id: Number(id) } })));
    }
}