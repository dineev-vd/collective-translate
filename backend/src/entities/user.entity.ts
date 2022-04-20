import { GetShortUserDto } from "common/dto/user.dto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;
    
    @Column()
    password: string;

    @Column()
    refreshToken: string;

    toGetShortUserDto(): GetShortUserDto {
        return {
            id: this.id,
            name: this.name
        }
    }
}