export class PostActionDto {
  textSegmentId: number;
  languageId?: number;
  change: string;
  comment?: string;
}

export class GetActionDto {
  textSegmentId: number;
  languageId?: number;
  change: string;
  comment?: string;
}
