import { GetTranslateLanguage, GetTranslateLanguageWithProject } from "@common/dto/language.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LanguageSegments from "../components/language-segments/LanguageSegments";

const LanguageSegmentsPage: React.FC = () => {
    const { languageId } = useParams();
    const [language, setLanguage] = useState<GetTranslateLanguageWithProject>();

    useEffect(() => {
        api.getLanguage(languageId).then(([response, _]) => {
            setLanguage(response);
        })
    }, [languageId])

    return <div>
        {language &&
            <>
                <h3>{language.language}</h3>
                <Link to={`/project/${language.project.id}`}>
                    {language.project.name}
                </Link>
            </>}
        <LanguageSegments />
    </div>
}

export default LanguageSegmentsPage;