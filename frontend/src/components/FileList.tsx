import { ChangeEvent, useEffect, useState } from "react";
import { ShortFileDto } from "@common/dto/file.dto"
import { Link, Outlet, Route, Routes, useParams } from "react-router-dom";
import { api } from "api/Api";
import FilePeek from "./FilePeek";
import "./FileList.css";

const FileList: React.FC = () => {
    const { projectId } = useParams();
    const [fileList, setFileList] = useState<ShortFileDto[]>();
    const [files, setFiles] = useState<FileList>();


    useEffect(() => {
        api.getFilesByProject(Number(projectId)).then(([reponse, _]) => {
            setFileList(reponse);
        })
    }, [])


    function fileChange(event: ChangeEvent<HTMLInputElement>) {
        setFiles(event.target.files);
    }

    function onUploadClick() {
        api.postTextFiles(projectId, files).then(([response, _]) => {
            setFileList(prev => [...prev, ...response]);
        });
    }

    return <div className="file-list">
        <div className="file-list_files">
            <input multiple type="file" onChange={fileChange} />
            <button onClick={onUploadClick}>Загрузить</button>
            {files && Array.from(files).map(f => {
                console.log(Array.from(files));
                return <h5>{f.name}</h5>
            })}
            {fileList && fileList.map((file) => {
                return <div>
                    <Link key={file.id} to={file.id.toString()}>
                        <h2>{file.name}</h2>
                    </Link>
                    <h4>{file.status}</h4>
                </div>
            })}
        </div>
        <Outlet />
    </div>
}

export default FileList;