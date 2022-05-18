import { SegmentStatus } from "common/enums";
import { GetTranslateLanguage } from "./language.dto";

export enum ChangeType {
  AFTER = 'after',
  BEFORE = 'before',
}

export class PostTranslationDto {
  id: string;
  comment: string;
  translationText: string;
}

export class GetTranslationDto {
  id: string;
  status: SegmentStatus;
  translationText: string;
  order: number;
  translationLanguageId: string;
  original?: GetTranslationDto;
  suggestionsIds: string[];
}
