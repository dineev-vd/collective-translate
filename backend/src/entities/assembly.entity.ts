import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { File } from './file.entity';

@Entity()
export class Assembly {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  name: string;

  @ManyToOne(() => File)
  file: File;
}
