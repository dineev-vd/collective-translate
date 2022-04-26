import { Language } from '../enums';
import { GetTranslationDto } from './translate-piece.dto';

export class GetTranslateLanguage {
  id: number;
  language: Language;
  translationSegments: GetTranslationDto[];
}

export class PostTranslateLanguage {
  language: Language;
}
