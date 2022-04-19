import { ChangeEvent, useState } from "react";
import { GetProjectDto } from "@common/dto/project.dto";
import { useEffect } from "react";
import { api } from "api/Api";
import { useParams } from "react-router-dom";

const ProjectSummary: React.FC<{  }> = () => {
    const { projectId } = useParams();
    const [summaryResponse, setSummaryResponse] = useState<GetProjectDto>();
    const [files, setFiles] = useState<FileList>();

    useEffect(() => {
        api.getProjectById(projectId)
            .then(([response, _]) => setSummaryResponse(response))
    }, [projectId])

    function fileChange(event: ChangeEvent<HTMLInputElement>) {
        setFiles(event.target.files);
    }

    function onUploadClick() {
        api.postTextFiles(projectId, files);
    }

    return <>
        {summaryResponse && (
            <div>
                <h1>{summaryResponse.name}</h1>
                <h4>{summaryResponse.description}</h4>
                {files && Array.from(files).map(f => {
                    console.log(Array.from(files));
                    return <h5>{f.name}</h5>
                })}
                <input multiple type="file" onChange={fileChange} />
                <button onClick={onUploadClick}>Загрузить</button>
            </div>)}
    </>
}

export default ProjectSummary;