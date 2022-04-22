import { GetShortUserDto } from 'common/dto/user.dto';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Project from './project.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  refreshToken: string;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  toGetShortUserDto(): GetShortUserDto {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
