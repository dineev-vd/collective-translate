import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {

    constructor() {
        this.id = -1;
        this.name = "";
        this.email = "";
        this.password = "";
    }
    
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;
    
    @Column()
    password: string;


}