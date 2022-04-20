import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
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
    
    @OneToMany(() => TranslatePiece, (piece) => piece.textPiece)
    translatePieces: TranslatePiece[];

    @RelationId((piece: TextPiece) => piece.translatePieces)
    translatePiecesIds: string[];
}