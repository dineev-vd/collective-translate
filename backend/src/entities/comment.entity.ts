import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Action } from './action.entity';

@Entity()
export class Comment {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Action)
  action: Action;

  @Column()
  comment: string;
}
