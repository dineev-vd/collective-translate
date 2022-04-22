import { GetTranslateLanguage } from "@common/dto/language.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Languages: React.FC = () => {
    const [state, changeState] = useState<GetTranslateLanguage[]>([]);
    const { projectId } = useParams();

    useEffect(() => {
        api.getLanguagesBtProjectId(Number(projectId)).then(([response, _]) => {
            changeState(response);
        })
    }, [])

    return <div>
        {state && state.map(language => (
            <Link to={`${language.id}`}><h2>{language.language}</h2></Link>
        ))}
    </div>
}

export default Languages;