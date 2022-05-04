import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import { TranslationLanguage } from './translation-language.entity';
import { File } from './file.entity';

@Entity()
export default class Project {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, { cascade: true })
  owner: User;

  @OneToMany(() => TranslationLanguage, (language) => language.project, {
    cascade: true,
  })
  translateLanguage: TranslationLanguage[];

  @Column({ default: '' })
  description: string;

  @OneToMany(() => File, (file) => file.project, { cascade: true })
  files: File[];

  @Column({ default: false })
  private: Boolean;
}
