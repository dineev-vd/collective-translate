import { GetShortUserDto } from 'common/dto/user.dto';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Project from './project.entity';

@Entity()
export default class User {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({default: ''})
  info: string;

  @Column({default: ''})
  refreshToken: string;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @ManyToMany(() => Project, project => project.editors)
  editableProjects: Project[];

  toGetShortUserDto(): GetShortUserDto {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
