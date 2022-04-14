import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Project from "./Project.entity";
import TranslatePiece from "./TranslatePiece.entity";

@Entity()
export class TextPiece {

    @ManyToOne(() => Project, {primary: true})
    project: Project;

    @PrimaryColumn()
    sequenceNumber: number;

    @Column()
    text: string;
    
    @ManyToMany(() => TranslatePiece)
    translatePieces: TranslatePiece[];
}