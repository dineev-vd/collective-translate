import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Project from "./project.entity";
import { TextSegment } from "./text-segment.entity";

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => TextSegment, textSegment => textSegment.file)
    textSegments: TextSegment[];

    @ManyToOne(() => Project)
    project: Project;
}