export class PostUserDto {
    email: string;
    password: string;
    name: string;
}

export class GetUserDto {
    id: number;
    name: string;
}

export class GetShortUserDto {
    id: number;
    name: string;
}