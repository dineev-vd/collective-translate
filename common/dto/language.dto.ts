import { Language } from "../enums";
import { GetTranslatePieceDto } from "./translate-piece.dto"

export class GetTranslateLanguage {
    id: number;
    language: Language;
}