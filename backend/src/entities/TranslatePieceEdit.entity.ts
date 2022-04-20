import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import TranslatePiece from "./TranslatePiece.entity";
import User from "./User.entity";

export enum ChangeType {
    AFTER = "after",
    BEFORE = "before"
}

@Entity()
export class TranslatePieceEdit {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    author: User;

    @Column()
    change: string;

    @Column({
        type: 'enum',
        enum: ChangeType,
        default: ChangeType.AFTER
    })
    changeType: ChangeType;

    @ManyToOne(() => TranslatePiece)
    owner: TranslatePiece;
}