import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Language } from 'common/enums';
import SegmentTranslation from './segment-translation.entity';
import Project from './project.entity';
import { Action } from './action.entity';

@Entity()
export class TranslationLanguage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Language,
  })
  language: Language;

  @OneToMany(
    () => SegmentTranslation,
    (segment) => segment.translationLanguage,
    { cascade: true },
  )
  translationSegments: SegmentTranslation[];

  @RelationId((language: TranslationLanguage) => language.translationSegments)
  translationSegmentsIds: number[];

  @ManyToOne(() => Project)
  project: Project;

  @OneToMany(() => Action, (action) => action.language)
  actions: Action[];
}
