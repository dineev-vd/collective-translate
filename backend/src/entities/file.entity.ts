import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import Project from './project.entity';
import { FileStatus } from 'util/enums';
import SegmentTranslation from './segment-translation.entity';

@Entity()
export class File {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SegmentTranslation, (textSegment) => textSegment.file, {
    cascade: ['insert'],
  })
  textSegments: SegmentTranslation[];

  @ManyToOne(() => Project)
  project: Project;

  @RelationId((file: File) => file.project)
  projectId: number;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  encoding: string;

  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.NEW,
  })
  status: FileStatus;
}
