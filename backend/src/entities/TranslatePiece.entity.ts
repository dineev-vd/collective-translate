import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import Project from "./Project.entity";
import { TextPiece } from "./TextPiece.entity";

@Entity()
class TranslatePiece {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TextPiece, (piece) => piece.translatePieces, { cascade: true })
    textPieces: TextPiece[];

    @RelationId((piece: TranslatePiece) => piece.textPieces)
    textPiecesIds: number[];

    @Column({ default: "" })
    after: string;

    @Column()
    before: string;

}

export default TranslatePiece;