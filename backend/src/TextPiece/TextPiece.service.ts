import { PostTextSegment } from 'common/dto/text-piece.dto';
import Project from 'entities/project.entity';
import { TextSegment } from 'entities/text-segment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class TextpieceService {
    constructor(
        @InjectRepository(TextSegment)
        private textPieceRepository: Repository<TextSegment>
    ) { }


    async savePieces(pieces: PostTextSegment[]) {
        return this.textPieceRepository.save(pieces);
    }

    async getPiece(id: string) {
        return this.textPieceRepository.findOne(id);
    }

    async getPiecesByProject(projectId: string) {
        return this.textPieceRepository.find({ where: { project: { id: projectId } } });
    }
}
