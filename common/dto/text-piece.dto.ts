import { GetTranslatePieceDto } from "./translate-piece.dto";

export class PostTextPieceDto {
    translatePiecesIds: string[];
    text: string;
}

export class GetTextPieceDto extends PostTextPieceDto {
    id: string;
}