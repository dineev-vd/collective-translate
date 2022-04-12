import { GetProjectDto } from "./get-project.dto";

export class GetProjectFullDto extends GetProjectDto {
    piecesId: number[];
}