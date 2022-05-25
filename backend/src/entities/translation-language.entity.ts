import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Language } from 'util/enums';
import SegmentTranslation from './segment-translation.entity';
import Project from './project.entity';
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

  @Column({ nullable: true })
  name: string;

  @OneToMany(
    () => SegmentTranslation,
    (segment) => segment.translationLanguage,
    { cascade: true },
  )
  translationSegments: SegmentTranslation[];

  @ManyToOne(() => Project)
  project: Project;

  @RelationId((languge: TranslationLanguage) => languge.project)
  projectId: number;

  @OneToMany(() => Assembly, (assembly) => assembly.language)
  assemblies: Assembly[];

  @Column({ default: false })
  original: boolean;
}
