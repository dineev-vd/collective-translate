import { GetUserDto } from "./user.dto";

export enum ChangeType {
    AFTER = "after",
    BEFORE = "before"
}

export class PostTranslatePieceDto {
    projectId?: number;
    before?: string;
    after?: string;
}

export class GetTranslatePieceDto extends PostTranslatePieceDto {
    id: number;
    textPieceId: string;
    history?: [{
        changeType: ChangeType,
        change: string,
        author: {
            id: string,
            name: string
        }
    }]
}