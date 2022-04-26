import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Action } from './action.entity';
import { File } from './file.entity';
import Project from './project.entity';
import SegmentTranslation from './segment-translation.entity';

@Entity()
export class TextSegment {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(() => TextSegment, { nullable: true })
  // @JoinColumn()
  // previous?: TextSegment;

  // @OneToOne(() => TextSegment, { nullable: true })
  // @JoinColumn()
  // next?: TextSegment;

  // @RelationId((segment: TextSegment) => segment.next)
  // nextId?: number;

  // @RelationId((segment: TextSegment) => segment.previous)
  // previousId?: number;

  @Column()
  order: number;

  @Column()
  text: string;

  @OneToMany(() => SegmentTranslation, (piece) => piece.textSegment, {
    cascade: true,
  })
  translations: SegmentTranslation[];

  // @RelationId((piece: TextSegment) => piece.translations)
  // translationIds: number[];

  @ManyToOne(() => File, (file) => file.textSegments)
  file: File;

  @RelationId((segment: TextSegment) => segment.file)
  fileId: number;

  @Column()
  shouldTranslate: boolean;

  @OneToMany(() => Action, action => action.segment, {cascade: true})
  actions: Action[];
}
