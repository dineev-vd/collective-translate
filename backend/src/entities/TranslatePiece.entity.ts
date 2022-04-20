import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import Project from "./Project.entity";
import { TextPiece } from "./TextPiece.entity";
import { TranslatePieceEdit } from "./TranslatePieceEdit.entity";

@Entity()
class TranslatePiece {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TextPiece, (piece) => piece.translatePieces, { cascade: true })
    textPiece: TextPiece;

    @RelationId((piece: TranslatePiece) => piece.textPiece)
    textPieceId: number;

    @Column({ default: "" })
    after: string;

    @Column()
    before: string;

    @ManyToOne(() => Project)
    project: Project;

    @OneToMany(() => TranslatePieceEdit, edit => edit.owner)
    history: TranslatePieceEdit[]

}

export default TranslatePiece;