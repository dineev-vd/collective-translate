import { Language } from 'common/enums';
import { GetShortUserDto } from './user.dto';

export class PostProjectDto {
  name: string;
  description: string;
  language: Language;
}

export class GetProjectDto {
  id: number;
  name: string;
  description: string;
  owner: GetShortUserDto;
}
