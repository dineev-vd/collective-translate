export class PostTextSegmentDto {
  id?: number;
  text?: string;
  comment: string;
}

export class GetTextSegmentDto {
  id: number;
  text: string;
  order: number;
  shouldTranslate: boolean;
}
