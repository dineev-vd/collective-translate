import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TextSegment } from './text-segment.entity';
import { TranslationLanguage } from './translation-language.entity';
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

  @ManyToOne(() => TextSegment, { cascade: ['update'], onDelete: 'CASCADE' })
  segment: TextSegment;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => TranslationLanguage, { nullable: true })
  language: TranslationLanguage;
}
