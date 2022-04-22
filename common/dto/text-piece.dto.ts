import { GetTranslationDto } from "./translate-piece.dto";

export class PostTextSegmentDto {
  id?: number;
  text?: string;
  comment: string;
}

export class GetTextSegmentDto {
  id: number;
  text: string;
  nextId: number;
  previousId: number;
  shouldTranslate: Boolean;
}
