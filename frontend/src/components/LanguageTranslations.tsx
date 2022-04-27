import { ShortFileDto } from "@common/dto/file.dto";
import { GetTranslateLanguage } from "@common/dto/language.dto";
import { GetTextSegmentDto } from "@common/dto/text-piece.dto";
import { GetTranslationDto } from "@common/dto/translate-piece.dto";
import { api } from "api/Api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

const TextSegments: React.FC<{}> = () => {
    const { projectId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [files, setFiles] = useState<ShortFileDto[]>([]);
    const languageId = useMemo(() => searchParams.get('languageId'), [searchParams]);
    const fileId = useMemo(() => searchParams.get('fileId'), [searchParams]);
    const [textSegments, setTextSegments] = useState<GetTextSegmentDto[]>([]);
    const [translations, setTranslations] = useState<{ [key: number]: GetTranslationDto }>({});
    const [languages, setLanguages] = useState<GetTranslateLanguage[]>([]);

    useEffect(() => {
        if (!projectId)
            return;

        api.getFilesByProject(Number(projectId)).then(([response, _]) => {
            setFiles(response);
        })

        api.getLanguagesBtProjectId(Number(projectId)).then(([response, _]) => {
            setLanguages(response);
        })
    }, [projectId])

    useEffect(() => {
        if (fileId) {
            api.getTextSegmentsByFile(fileId).then(([response, _]) => {
                setTextSegments(response);
            })

            return;
        }

        api.getTextSegmentsByProject(projectId).then(([response, _]) => {
            setTextSegments(response);
        })


    }, [projectId, fileId])

    useEffect(() => {
        if (!languageId || textSegments.length == 0) {
            return;
        }

        console.log(languageId)

        api.getTranslations({ languageId: languageId, textSegmentsIds: textSegments.map(segment => segment.id) }).then(([response, _]) => {
            let obj = {};
            response.forEach(trans => obj[trans.textSegmentId] = trans);
            setTranslations(obj);
        })
    }, [languageId, textSegments])

    const handleSelect = useCallback((e) => {
        const params = new URLSearchParams(searchParams);
        if(e.currentTarget.value == -1) {
            params.delete('fileId');
        } else {
            params.set('fileId', e.currentTarget.value);
        } 


        setSearchParams(params);
    }, [searchParams])

    const handleLanguageSelect = useCallback((e) => {
        const params = new URLSearchParams(searchParams);
        if(e.currentTarget.value == -1) {
            params.delete('languageId');
        } else {
            params.set('languageId', e.currentTarget.value);
        } 


        setSearchParams(params);
    }, [searchParams])

    return <>
        <select value={fileId ?? -1} onChange={handleSelect}>
            <option value={-1}>Все</option>
            {files && files.map(file => (
                <option key={file.id} value={file.id}>{file.name}</option>
            ))}
        </select>
        <select value={languageId ?? -1} onChange={handleLanguageSelect}>
            <option value={-1}>Все</option>
            {languages && languages.map(language => (
                <option key={language.id} value={language.id}>{language.language}</option>
            ))}
        </select>

        {textSegments && textSegments.map((segment, index) => (
            <div key={segment.id} style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", border: "1px solid black", borderRadius: "10px" }}>

                <Link to={`/translate/${segment.id.toString()}?languageId=${languageId}`}><h4>Перейти</h4></Link>
                <div style={{ width: "100%" }}>
                    Текст до:
                    <input style={{ width: "100%", boxSizing: "border-box" }} value={segment.text} disabled />
                </div>
                {languageId && (translations[segment.id]) && <div style={{ width: "100%" }}>
                    Текст после:
                    <input style={{ width: "100%", boxSizing: "border-box" }} value={translations[segment.id].translationText} disabled />
                </div>}
            </div>
        ))}
    </>
}

export default TextSegments;