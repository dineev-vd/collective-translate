import { PostTextSegmentDto } from 'common/dto/text-piece.dto';
import { TextSegment } from 'entities/text-segment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class TextSegmentService {
  constructor(
    @InjectRepository(TextSegment)
    private testSegmentRepository: Repository<TextSegment>,
  ) {}

  async savePieces(pieces: PostTextSegmentDto[]) {
    return this.testSegmentRepository.save(pieces);
  }

  async getPiece(id: number) {
    return this.testSegmentRepository.findOne({ where: { id: id } });
  }

  async getPiecesByFile(fileId: string) {
    return this.testSegmentRepository.find({
      where: { file: { id: fileId } },
    });
  }

  async getPrev(segment: TextSegment, amount: number) {
    const prev = await this.testSegmentRepository.find({
      take: amount,
      order: { order: 'DESC' },
      where: { order: LessThan(segment.order) },
    });

    return prev.reverse();
  }

  async getNext(segment: TextSegment, amount: number) {
    return this.testSegmentRepository.find({
      take: amount,
      order: { order: 'ASC' },
      where: { order: MoreThan(segment.order) },
    });
  }

  async getBatch(fileId: string, skip: number, take: number) {
    return this.testSegmentRepository.find({
      take: take,
      skip: skip,
      order: { order: 'ASC' },
      where: { file: { id: fileId } },
      relations: ['translations'],
    });
  }

  async getFirstTextSegment(fileId: string) {
    return this.testSegmentRepository.findOne({
      where: { previous: IsNull(), file: { id: fileId } },
    });
  }

  async getSegmentsForTranslation(fileId: string) {
    return this.testSegmentRepository.find({
      where: { file: { id: fileId }, shouldTranslate: true },
    });
  }

  async insertTextSegments(segments: TextSegment[]) {
    return this.testSegmentRepository.insert(segments);
  }
}
