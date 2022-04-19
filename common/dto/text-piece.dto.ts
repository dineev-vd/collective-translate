export class PostTextPieceDto {
    sequenceNumber: number;
    text: string;
}

export class GetTextPieceDto extends PostTextPieceDto {
    projectId: string;
}