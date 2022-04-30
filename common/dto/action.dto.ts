import { GetUserDto } from "./user.dto";

export class PostActionDto {
  textSegmentId: number;
  change: string;
  comment?: string;
}

export class GetActionDto {
  id: string;
  textSegmentId: number;
  change: string;
  comment?: string;
  author: GetUserDto;
}
