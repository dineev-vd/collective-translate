import { ShortFileDto } from "@common/dto/file.dto";
import { GetTranslateLanguage } from "@common/dto/language.dto";
import { GetTranslationDto } from "@common/dto/translate-piece.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const LanguageTranslations: React.FC<{}> = () => {
    const { languageId, projectId } = useParams();
    const [translation, setTranslation] = useState<GetTranslationDto[]>();
    const [fileId, setFileId] = useState<number>(null)
    const [files, setFiles] = useState<ShortFileDto[]>([]);


    useEffect(() => {
        api.getFilesByProject(Number(projectId)).then(([response, _]) => {
            setFiles(response);
        })
    }, [projectId])

    useEffect(() => {
        api.getTranslationsByLanguage(Number(languageId), fileId == -1 ? null : fileId)
            .then(([translation, _]) => {
                setTranslation(translation);
            })

    }, [languageId, fileId])

    function handleSelect(e) {
        console.log(e.currentTarget.value);
        setFileId(Number(e.currentTarget.value))
    }

    return <>
    
        <select onChange={handleSelect}>
            <option value={-1}>Все</option>
            {files && files.map(file => (
                <option value={file.id}>{file.name}</option>
            ))}
        </select>

        {translation && translation.map(segment => (
            <div style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", border: "1px solid black", borderRadius: "10px" }}>
                
                <Link to={segment.id.toString()}><h4>Перейти</h4></Link>
                <div style={{ width: "100%" }}>
                    Текст до:
                    {/* <input style={{ width: "100%", boxSizing: "border-box" }} value={segment.textSegment.text} disabled /> */}
                </div>
                <div style={{ width: "100%" }}>
                    Текст после:
                    <input style={{ width: "100%", boxSizing: "border-box" }} value={segment.translationText} disabled />
                </div>
            </div>
        ))}
    </>
}

export default LanguageTranslations;