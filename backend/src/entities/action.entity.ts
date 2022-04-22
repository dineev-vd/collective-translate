import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import SegmentTranslation from './segment-translation.entity';
import User from './user.entity';

export enum ChangeType {
  COMMENT = 'comment',
}

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  author: User;

  @Column()
  change?: string;

  @ManyToOne(() => SegmentTranslation)
  segment: SegmentTranslation;

  @Column()
  comment: string;
}
