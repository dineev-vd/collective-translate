import { SegmentStatus } from 'common/enums';
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
import { Action } from './action.entity';
import { File } from './file.entity';
import { Suggestion } from './suggestion.entity';
import { TranslationLanguage } from './translation-language.entity';

@Entity()
class SegmentTranslation {
  @Index()
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  translationText?: string;

  @ManyToOne(
    () => TranslationLanguage,
    (language) => language.translationSegments,
  )
  translationLanguage: TranslationLanguage;

  @RelationId((segment: SegmentTranslation) => segment.translationLanguage)
  translationLanguageId: number;

  @ManyToOne(
    () => File,
    (file) => file.textSegments
  )
  file: File;

  @RelationId((segment: SegmentTranslation) => segment.file)
  fileId: number;

  @Column()
  order: number;

  @Column()
  shouldTranslate: Boolean;

  @Column({
    type: "enum",
    enum: SegmentStatus,
    default: SegmentStatus.NEW
  })
  status: SegmentStatus;

  @OneToMany(() => Suggestion, suggestion => suggestion.segment)
  suggestions: Suggestion[];

  @RelationId((segment: SegmentTranslation) => segment.suggestions)
  suggestionsIds: string[];

  @OneToMany(() => Action, action => action.segment, {cascade: true})
  actions: Action[]
}

export default SegmentTranslation;
