import { Language } from 'util/enums';
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
  private?: boolean;
  all?: number;
  translated?: number;
  editorsId: string[];
  ownerId: string;
}

export class ChangeProjectDto {
  name: string;
  description: string;
}
