import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import Project from './project.entity';
import { TextSegment } from './text-segment.entity';
import { FileStatus } from 'common/enums';
import { Assembly } from './assembly.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => TextSegment, (textSegment) => textSegment.file, {
    cascade: ['insert'],
  })
  textSegments: TextSegment[];

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

  @OneToMany(() => Assembly, (assembly) => assembly.file)
  assemblies: Assembly[];
}
