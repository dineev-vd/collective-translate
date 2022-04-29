import { ShortFileDto } from "@common/dto/file.dto";
import { GetTranslateLanguage } from "@common/dto/language.dto";
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
    const [textSegments, setTextSegments] = useState<GetTranslationDto[]>([]);
    const [translations, setTranslations] = useState<GetTranslationDto[]>([]);
    const [languages, setLanguages] = useState<GetTranslateLanguage[]>([]);
    const originalId = useMemo(() => languages.find(l => l.original)?.id, [languages])

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
        languages.length > 0 && handleLanguageSelect(languages[0].id);
    }, [languages])

    useEffect(() => {
        handleSelect(-1);
    }, [files])

    useEffect(() => {
        if (!languageId)
            return;



        api.getTranslationsByLanguage(languageId, { fileId: fileId }).then(([response, _]) => {
            setTextSegments(response);
        })
    }, [languageId, fileId])

    useEffect(() => {
        if (!languageId || textSegments.length == 0) {
            return;
        }

        if (languageId == originalId) {
            setTranslations([]);
            return;
        }

        api.getTranslationsByOrders(languageId, textSegments.map(segment => segment.order)).then(([response, _]) => {
            setTranslations(response);
        })
    }, [languageId, textSegments])

    const handleSelect = useCallback((value) => {
        const params = new URLSearchParams(searchParams);
        if (value == -1) {
            params.delete('fileId');
        } else {
            params.set('fileId', value);
        }


        setSearchParams(params);
    }, [searchParams])

    const handleLanguageSelect = useCallback((value) => {
        const params = new URLSearchParams(searchParams);
        if (value == -1) {
            params.delete('languageId');
        } else {
            params.set('languageId', value);
        }


        setSearchParams(params);
    }, [searchParams])

    return <div style={{ "display": "flex", "flexDirection": "column", "height": "100%", "position": "relative", "bottom": 0 }}>
        <div>
            <select value={fileId ?? -1} onChange={(e) => handleSelect(e.currentTarget.value)}>
                <option value={-1}>Все файлы</option>
                {files && files.map(file => (
                    <option key={file.id} value={file.id}>{file.name}</option>
                ))}
            </select>
            <select value={languageId ?? -1} onChange={(e) => handleLanguageSelect(e.currentTarget.value)}>
                {languages && languages.map(language => (
                    <option key={language.id} value={language.id}>{language.language}</option>
                ))}
            </select>
        </div>

        <div style={{"overflowY": "scroll", "flex": "1 1 100px"}}>
            <div style={{ "maxHeight":"100%" }}>
                {textSegments && textSegments.map((segment, index) => (
                    <div key={segment.id} style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", border: "1px solid black", borderRadius: "10px" }}>
                        <Link to={`/translate/${segment.id.toString()}?languageId=${languageId}`}><h4>Перейти</h4></Link>
                        <div style={{ width: "100%" }}>
                            Текст до:
                            <input style={{ width: "100%", boxSizing: "border-box" }} value={segment.translationText} disabled />
                        </div>
                        {translations.length > 0 && <div style={{ width: "100%" }}>
                            Текст после:
                            <input style={{ width: "100%", boxSizing: "border-box" }} value={translations[index].translationText} disabled />
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    </div>
}

export default TextSegments;