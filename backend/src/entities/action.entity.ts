import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import SegmentTranslation from './segment-translation.entity';
import User from './user.entity';

@Entity()
export class Action {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  author: User;

  @Column()
  change: string;

  @ManyToOne(() => SegmentTranslation, {
    cascade: ['update'],
    onDelete: 'CASCADE',
  })
  segment: SegmentTranslation;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  timestamp: Date;
}
