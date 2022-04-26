import { GetTranslateLanguage } from "@common/dto/language.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
        api.getLanguagesBtProjectId(Number(projectId)).then(([response, _]) => {
            changeState(response);
        })
    }, [])

    function handleCreateLanguage() {
        api.postLanguage(projectId, {language: language}).then(([response, _]) => {
            window.location.reload();
        })
    }

    return <div>
        <select onChange={e => setLanguage(Language[e.currentTarget.value])}>
            {Object.keys(Language).map(l => (
                <option selected={language == Language[l]}>{l}</option>
            ))}
        </select>
        <button onClick={handleCreateLanguage}>Создать язык</button>
        {state && state.map(language => (
            <Link to={`/languages/${language.id}`}><h2>{language.language}</h2></Link>
        ))}
    </div>
}

export default Languages;