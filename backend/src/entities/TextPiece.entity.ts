import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Project from "./Project.entity";
import TranslatePiece from "./TranslatePiece.entity";

@Entity()
export class TextPiece {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project)
    project: Project;

    @OneToOne(() => TextPiece, {nullable: true})
    @JoinColumn()
    previous?: TextPiece;

    @OneToOne(() => TextPiece, {nullable: true})
    @JoinColumn()
    next?: TextPiece;

    @Column()
    text: string;
    
    @OneToMany(() => TranslatePiece, (piece) => piece.textPieces)
    translatePieces: TranslatePiece[];
}