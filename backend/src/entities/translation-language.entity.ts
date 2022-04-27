import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Language } from 'common/enums';
import SegmentTranslation from './segment-translation.entity';
import Project from './project.entity';
import { Action } from './action.entity';
import { Assembly } from './assembly.entity';

@Entity()
export class TranslationLanguage {
  @Index()
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

  // @RelationId((language: TranslationLanguage) => language.translationSegments)
  // translationSegmentsIds: number[];

  @ManyToOne(() => Project)
  project: Project;

  @RelationId((languge: TranslationLanguage) => languge.project)
  projectId: number;

  @OneToMany(() => Action, (action) => action.language)
  actions: Action[];

  @OneToMany(() => Assembly, (assembly) => assembly.language)
  assemblies: Assembly[];
}
