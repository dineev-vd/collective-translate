export enum ChangeType {
  AFTER = 'after',
  BEFORE = 'before',
}

export class PostTranslationDto {
  id?: number;
  translationText?: string;
  comment: string;
}

export class GetTranslationDto {
  id: number;
  textSegmentId: number;
  translationText: string;
}
