import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
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

  @RelationId((project: Project) => project.owner)
  ownerId: string;

  @OneToMany(() => TranslationLanguage, (language) => language.project, {
    cascade: true,
  })
  translateLanguage: TranslationLanguage[];

  @Column({ default: '' })
  description: string;

  @OneToMany(() => File, (file) => file.project, { cascade: true })
  files: File[];

  @Column({ default: false })
  private: boolean;

  @ManyToMany(() => User, (user) => user.editableProjects, { cascade: true })
  @JoinTable({
    joinColumn: {
      name: 'editor',
    },
    inverseJoinColumn: {
      name: 'project',
    },
  })
  editors: User[];

  @RelationId((project: Project) => project.editors)
  editorsId: string[];
}
