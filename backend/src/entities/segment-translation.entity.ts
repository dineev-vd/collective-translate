import {
  Column,
  Entity,
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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TextSegment, (piece) => piece.translations, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  textSegment: TextSegment;

  @RelationId((piece: SegmentTranslation) => piece.textSegment)
  textSegmentId: number;

  @Column({ default: '' })
  translationText: string;

  @OneToMany(() => Action, (action) => action.segment)
  actions: Action[];

  @ManyToOne(
    () => TranslationLanguage,
    (language) => language.translationSegments,
  )
  translationLanguage: TranslationLanguage;

  @RelationId((segment: SegmentTranslation) => segment.translationLanguage)
  translationLanguageId: number;
}

export default SegmentTranslation;
