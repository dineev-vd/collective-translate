export class ShortFileDto {
  id: number;
  name: string;
  status: string;
}

export type PeekFileDto = {
  text: { marked: Boolean, text: string }[];
};
