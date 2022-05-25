import { FileStatus } from 'util/enums';

export class ShortFileDto {
  id: number;
  name: string;
  status: FileStatus;
  all?: number;
  translated?: number;
}

export type PeekFileDto = {
  text: { marked: boolean; text: string }[];
};
