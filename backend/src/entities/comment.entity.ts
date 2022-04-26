import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Action } from './action.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Action)
  action: Action;

  @Column()
  comment: string;
}
