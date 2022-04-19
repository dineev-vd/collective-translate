import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import TranslatePiece from "./TranslatePiece.entity";
import User from "./User.entity";
import {GetProjectDto} from "common/dto/project.dto"
import { TextPiece } from "./TextPiece.entity";

@Entity()
export default class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => User)
    owner: User;

    @OneToMany(() => TextPiece, (textPieceEntity => textPieceEntity.project), {cascade: true})
    text: TextPiece[];

    @Column({default: ""})
    description: string;

    toDataTransferObject(): GetProjectDto {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
        }
    }
}