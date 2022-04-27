import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TranslationLanguage } from './translation-language.entity';

@Entity()
export class Assembly {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  name: string;

  @ManyToOne(() => TranslationLanguage, { cascade: ['update'] })
  language: TranslationLanguage;
}
