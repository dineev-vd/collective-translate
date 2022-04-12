import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Project from "./Project.entity";

@Entity()
class TranslatePiece {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project)
    project: Project

    @Column()
    before: string;

    @Column()
    after: string;

}

export default TranslatePiece;