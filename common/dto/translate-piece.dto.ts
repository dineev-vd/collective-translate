export enum ChangeType {
  AFTER = 'after',
  BEFORE = 'before',
}

export class PostTranslationDto {
  id?: number;
  comment: string;
  translationText: string;
}

export class GetTranslationDto {
  id: number;
  translationText: string;
  order: number;
}
