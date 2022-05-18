export class PostUserDto {
  email: string;
  password: string;
  name: string;
}

export class ChangeUserDto {
  email?: string;
  password?: string;
  name?: string;
  info?: string;
}

export class GetUserDto {
  id: number;
  name: string;
  email: string;
  info: string;
}

export class GetShortUserDto {
  id: number;
  name: string;
}
