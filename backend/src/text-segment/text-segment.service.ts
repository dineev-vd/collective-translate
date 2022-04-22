import { PostTextSegmentDto } from 'common/dto/text-piece.dto';
import Project from 'entities/project.entity';
import { TextSegment } from 'entities/text-segment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class TextSegmentService {
  constructor(
    @InjectRepository(TextSegment)
    private testSegmentRepository: Repository<TextSegment>,
  ) { }

  async savePieces(pieces: PostTextSegmentDto[]) {
    return this.testSegmentRepository.save(pieces);
  }

  async getPiece(id: number) {
      return this.testSegmentRepository.findOne({ where: { id: id } })
  }

  async getPiecesByProject(projectId: string) {
    return this.testSegmentRepository.find({
      where: { project: { id: projectId } },
    });
  }
}
