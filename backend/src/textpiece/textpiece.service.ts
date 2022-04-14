import Project from '@entities/Project.entity';
import { TextPiece } from '@entities/TextPiece.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TextpieceService {
    constructor(
        @InjectRepository(TextPiece)
        private textPieceRepository: Repository<TextPiece>
    ) { }

    async splitText(project: Project, text: string) {
        // TODO: change 'text' type to stream and process accordingly
        const textPieceArray = await this.makeTextPiecesArray(project, text);
        return this.textPieceRepository.save(textPieceArray);
    }

    async makeTextPiecesArray(project: Project, text: string) {
        const splitStringArray = text.match(/(.|[\r\n]){1,10000}/g);

        if (!splitStringArray) {
            console.log("no matches");
            return;
        }

        const textPieceArray = splitStringArray.map((chunk, index) => {
            const piece = new TextPiece();
            piece.text = chunk;
            piece.project = project;
            piece.sequenceNumber = index;
            return piece;
        })

        return textPieceArray;
    }

    async savePieces(pieces: TextPiece[]) {
        return this.textPieceRepository.save(pieces);
    }
}
