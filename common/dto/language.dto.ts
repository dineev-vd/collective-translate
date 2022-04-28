import { Language } from '../enums';
import { GetTranslationDto } from './translate-piece.dto';

export class GetTranslateLanguage {
  id: string;
  language: Language;
  translationSegments: GetTranslationDto[];
  original: Boolean;
}

export class PostTranslateLanguage {
  language: Language;
}
