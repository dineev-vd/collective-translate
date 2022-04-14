import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository, UpdateResult } from "typeorm";
import TranslatePiece from "@entities/TranslatePiece.entity";

@Injectable()
export class PieceService {
    constructor(
        @InjectRepository(TranslatePiece)
        private pieceRepository: Repository<TranslatePiece>
    ) { }


    getPiece(id: string): Promise<TranslatePiece> {
        return this.pieceRepository.findOne(id);
    }

    getPiecesByProject(projectId: string): Promise<TranslatePiece[]> {
        return this.pieceRepository.find({ where: { project: projectId }})
    }

    updatePiece(id: string, piece: DeepPartial<TranslatePiece>): Promise<UpdateResult> {
        return this.pieceRepository.update(id, piece);
    }

}