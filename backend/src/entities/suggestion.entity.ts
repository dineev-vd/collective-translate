import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import SegmentTranslation from './segment-translation.entity';
import User from './user.entity';

@Entity()
export class Suggestion {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  suggestion: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => SegmentTranslation, { cascade: ['update'] })
  segment: SegmentTranslation;
}
