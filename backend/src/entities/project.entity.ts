import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import SegmentTranslation from './segment-translation.entity';
import User from './user.entity';
import { GetProjectDto } from 'common/dto/project.dto';
import { TextSegment } from './text-segment.entity';
import { TranslationLanguage } from './translation-language.entity';
import { File } from './file.entity';

@Entity()
export default class Project {
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
}
