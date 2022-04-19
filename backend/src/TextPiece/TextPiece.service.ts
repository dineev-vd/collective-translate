import { PostTextPieceDto } from 'common/dto/text-piece.dto';
import Project from 'entities/Project.entity';
import { TextPiece } from 'entities/TextPiece.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

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

        const textPieceArray = splitStringArray.map((chunk, index, array) => {
            const piece = new TextPiece();
            piece.text = chunk;
            piece.project = project;
            return piece;
        })

        textPieceArray.forEach((piece, index, array) => {
            piece.previous = index > 0 ? array[index - 1] : null;
            piece.next = index < array.length - 1 ? array[index + 1] : null;
        })



        return textPieceArray;
    }

    async savePieces(pieces: PostTextPieceDto[]) {
        return this.textPieceRepository.save(pieces);
    }

    async getPiece(projectId: string, sequenceNumber: string[]) {
        return this.textPieceRepository.find({where: {project: {id: projectId}, sequenceNumber: In(sequenceNumber)}, relations: ['translatePieces']});
    }
}
