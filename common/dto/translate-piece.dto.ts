export class GetTranslatePieceDto {
    projectId: number;
    before: string;
    after: string;
}

export class PostTranslatePieceDto extends GetTranslatePieceDto {
    id: number;
}