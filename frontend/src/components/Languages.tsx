import { GetTranslateLanguage } from "@common/dto/language.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import LanguageDetails from "./LanguageDetails";

export enum Language {
    RUSSIAN = 'russian',
    ENGLISH = 'english',
    GERMAN = 'german',
}

const Languages: React.FC = () => {
    const [state, changeState] = useState<GetTranslateLanguage[]>([]);
    const { projectId } = useParams();
    const [language, setLanguage] = useState<Language>();

    useEffect(() => {
        setLanguage(Language.RUSSIAN)

        api.getLanguagesBtProjectId(Number(projectId)).then(([response, _]) => {
            changeState(response);
        })
    }, [])

    function handleCreateLanguage() {
        api.postLanguage(projectId, { language: language }).then(([response, _]) => {
            window.location.reload();
        })
    }

    return <div>
        <select value={language} onChange={e => setLanguage(e.currentTarget.value as Language)}>
            {Object.values(Language).map(l => (
                <option>{l}</option>
            ))}
        </select>
        <button onClick={handleCreateLanguage}>Создать язык</button>
        <div style={{"display":"flex", "width": "100%"}}>
            <div style={{"width": "100%"}}>
                {state && state.map(language => (
                    <Link to={`${language.id}`}><h2>{language.language}</h2></Link>
                ))}
            </div>
            <Routes>
                <Route path=":languageId" element={<LanguageDetails />} />
            </Routes>
        </div>
    </div>
}

export default Languages;