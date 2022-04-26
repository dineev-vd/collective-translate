import { useEffect, useState } from "react";
import { ShortFileDto } from "@common/dto/file.dto"
import { Link, Route, Routes, useParams } from "react-router-dom";
import { api } from "api/Api";
import FilePeek from "./FilePeek";

const FileList: React.FC = () => {
    const { projectId } = useParams();
    const [fileList, setFileList] = useState<ShortFileDto[]>();

    useEffect(() => {
        api.getFilesByProject(Number(projectId)).then(([reponse, _]) => {
            setFileList(reponse);
        })
    }, [])


    return <>
        {fileList && fileList.map((file) => {
            return <div>
                <Link key={file.id} to={file.id.toString()}>
                    <h2>{file.name}</h2>
                    </Link>
                    <h4>{file.status}</h4>
            </div>
        })}
        <Routes>
            <Route path=":fileId" element={<FilePeek />} />
        </Routes>
    </>
}

export default FileList;