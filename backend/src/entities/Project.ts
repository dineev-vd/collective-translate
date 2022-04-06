import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Project {
    constructor(id: number) {
        this.id = id
    }

    @PrimaryGeneratedColumn()
    id: number
}