import { ChangeEvent, useState } from "react";
import { GetProjectDto } from "@common/dto/project.dto";
import { useEffect } from "react";
import { api } from "api/Api";
import { useParams } from "react-router-dom";

const ProjectSummary: React.FC<{  }> = () => {
    const { projectId } = useParams();
    const [summaryResponse, setSummaryResponse] = useState<GetProjectDto>();

    useEffect(() => {
        api.getProjectById(projectId)
            .then(([response, _]) => setSummaryResponse(response))
    }, [projectId])

    

    return <>
        {summaryResponse && (
            <div>
                <h1>{summaryResponse.name}</h1>
                <h4>{summaryResponse.description}</h4>
            </div>)}
    </>
}

export default ProjectSummary;