import { PostTextSegmentDto } from 'common/dto/text-piece.dto';
import { TextSegment } from 'entities/text-segment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class TextSegmentService {
  constructor(
    @InjectRepository(TextSegment)
    private testSegmentRepository: Repository<TextSegment>,
  ) { }

  async removeSegmentsFromFile(fileId: number) {
    return this.testSegmentRepository.delete({ file: { id: fileId } });
  }

  async savePieces(pieces: PostTextSegmentDto[]) {
    return this.testSegmentRepository.save(pieces);
  }

  async getPiece(id: number) {
    return this.testSegmentRepository.findOne({ where: { id: id } });
  }

  async getSegmentsByProject(
    projectId: string,
    take?: number,
    page?: number,
    shouldTranslate = true,
  ) {
    return this.testSegmentRepository.find({
      where: {
        file: { project: { id: projectId } },
        shouldTranslate: shouldTranslate,
      },
      take: take || 10,
      skip: (page - 1) * take || 0,
      relations: ['file'],
    });
  }

  async getPiecesByFile(
    fileId: string,
    take?: number,
    page?: number,
    shouldTranslate = true,
  ) {
    return this.testSegmentRepository.find({
      take: take || 10,
      skip: (page - 1) * take || 0,
      where: { file: { id: fileId }, shouldTranslate: shouldTranslate },
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

    const chunkSize = 1000;
    let arr: ObjectLiteral[] = [];
    for (let i = 0; i < segments.length; i += chunkSize) {
      const chunk = segments.slice(i, i + chunkSize);
      const { identifiers } = await this.testSegmentRepository.createQueryBuilder().insert().values(chunk).execute()
      arr = arr.concat(identifiers);
    }

    return arr;
  }
}
