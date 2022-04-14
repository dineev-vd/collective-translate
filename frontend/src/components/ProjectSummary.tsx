import { ChangeEvent, useState } from "react";
import { GetProjectFullDto } from "@common/dto/get-project-full.dto";
import { useEffect } from "react";
import { api } from "api/Api";

const ProjectSummary: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [summaryResponse, setSummaryResponse] = useState<GetProjectFullDto>();
    const [files, setFiles] = useState<FileList>();

    useEffect(() => {
        api.getProjectById(projectId)
            .then(response => setSummaryResponse(response))
    }, [projectId])

    function fileChange(event: ChangeEvent<HTMLInputElement>) {
        setFiles(event.target.files);
    }

    function onUploadClick() {
        api.uploadTextFiles(projectId, files);
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
                <textarea value={summaryResponse.text}></textarea>
            </div>)}
    </>
}

export default ProjectSummary;