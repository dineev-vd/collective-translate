import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Project from "./Project.entity";
import { TextPiece } from "./TextPiece.entity";

@Entity()
class TranslatePiece {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, {cascade: false})
    project: Project;

    @ManyToMany(() => TextPiece, {cascade: true})
    @JoinTable()
    textPieces: TextPiece[];

    @Column({default: ""})
    after: string;

    @Column()
    before: string;

}

export default TranslatePiece;