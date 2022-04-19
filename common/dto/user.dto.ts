export class PostUserDto {
    email: string;
    password: string;
    name: string;
}

export class GetUserDto extends PostUserDto {
    id: string;
}