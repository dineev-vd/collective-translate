import { GetProjectFullDto } from "@common/dto/get-project-full.dto";
import { GetProjectDto } from "@common/dto/get-project.dto";
import { TranslatePieceDto } from "@common/dto/get-translate-piece.dto";

class ApiClass {
    apiUrl: string = window.location.origin + "/api";

    // search for translation project by user-typed query
    async getProjectsByQuery(query: string): Promise<GetProjectDto[]> {
        const response = await fetch(`${this.apiUrl}/project?query=${query}`);
        const json = await response.json();

        return json;
    }

    async getProjectById(id: string): Promise<GetProjectFullDto> {
        const response = await fetch(`${this.apiUrl}/project/${id}`);
        const json = await response.json();

        return json;
    }

    async getProjectPieces(id: string): Promise<TranslatePieceDto[]> {
        const response = await fetch(`${this.apiUrl}/piece?projectId=${id}`);
        const json = await response.json();

        return json;
    }

    async uploadTextFiles(id: string, files: FileList) {
        const formData = new FormData();
        Array.from(files).forEach(f => formData.append(f.name, f))

        const response = await fetch(`${this.apiUrl}/project/upload/${id}`, {method: "POST", body: formData})
        const json = await response.json();

        return json;
    }
}

export const api = new ApiClass();