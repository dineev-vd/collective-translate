import { GetShortUserDto } from "./user.dto";

export class PostProjectDto {
    name: string;
    description: string;
}

export class GetProjectDto {
    id: number;
    name: string;
    description: string;
    owner: GetShortUserDto;
}
