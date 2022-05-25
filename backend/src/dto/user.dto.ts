import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostUserDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  name: string;
}

export class ChangeUserDto {
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  password?: string;
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  info?: string;
}

export class GetUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  info: string;
}

export class GetShortUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
