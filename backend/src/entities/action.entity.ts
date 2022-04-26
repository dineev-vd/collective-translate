import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { TextSegment } from './text-segment.entity';
import { TranslationLanguage } from './translation-language.entity';
import User from './user.entity';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  author: User;

  @Column()
  change: string;

  @ManyToOne(() => TextSegment, { cascade: ['update'] })
  segment: TextSegment;

  @Column({nullable: true})
  comment: string;

  @ManyToOne(() => TranslationLanguage, { nullable: true })
  language: TranslationLanguage;
}
