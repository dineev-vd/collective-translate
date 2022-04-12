import { GetProjectFullDto } from "@common/dto/get-project-full.dto";
import { GetProjectDto } from "@common/dto/get-project.dto";

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
}

export const api = new ApiClass();