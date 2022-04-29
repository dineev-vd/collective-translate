import { GetTranslateLanguage } from "./language.dto";

export enum ChangeType {
  AFTER = 'after',
  BEFORE = 'before',
}

export class PostTranslationDto {
  id: number;
  comment: string;
  translationText: string;
}

export class GetTranslationDto {
  id: string;
  translationText: string;
  order: number;
  translationLanguageId: number;
  original?: GetTranslationDto;
}
