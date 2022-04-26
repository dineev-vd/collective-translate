import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { TextSegment } from './text-segment.entity';
import { Action } from './action.entity';
import { TranslationLanguage } from './translation-language.entity';

@Entity()
class SegmentTranslation {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TextSegment, (piece) => piece.translations, {
    cascade: ['insert', 'update'], onDelete: 'CASCADE'
  })
  @JoinColumn()
  textSegment: TextSegment;

  @RelationId((piece: SegmentTranslation) => piece.textSegment)
  textSegmentId: number;

  @Column({ default: '' })
  translationText: string;

  @ManyToOne(
    () => TranslationLanguage,
    (language) => language.translationSegments,
  )
  translationLanguage: TranslationLanguage;

  @RelationId((segment: SegmentTranslation) => segment.translationLanguage)
  translationLanguageId: number;
}

export default SegmentTranslation;
