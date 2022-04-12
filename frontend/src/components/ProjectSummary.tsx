import { useState } from "react";
import { GetProjectFullDto } from "@common/dto/get-project-full.dto";
import { useEffect } from "react";
import { api } from "api/Api";

const ProjectSummary: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [summaryResponse, setSummaryResponse] = useState<GetProjectFullDto>();
    
    useEffect(() => {
        api.getProjectById(projectId)
            .then(response => setSummaryResponse(response))
    }, [])

    return <>
        {summaryResponse && (<div>
            <h1>{summaryResponse.name}</h1>
            <h4>{summaryResponse.description}</h4>
        </div>)}
    </>
}

export default ProjectSummary;