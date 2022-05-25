import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RegularExpression {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  regexp: string;
}
