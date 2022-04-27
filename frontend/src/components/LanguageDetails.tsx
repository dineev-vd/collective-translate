import { GetAssemblyDto } from "@common/dto/assembly.dto";
import { GetTranslateLanguage } from "@common/dto/language.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const LanguageDetails: React.FC = () => {
    const { languageId } = useParams();
    const [language, setLanguage] = useState<GetTranslateLanguage>();
    const [assemblies, setAssemblies] = useState<GetAssemblyDto[]>();


    useEffect(() => {
        api.getLanguage(languageId).then(([response, _]) => {
            setLanguage(response);
        })

        api.getAssembliesByLanguage(languageId).then(([response, _]) => {
            setAssemblies(response);
        })

    }, [languageId])

    function handleAssemble() {
        api.assembleLanguage(languageId).then(() => {

        })
    }

    return <>
        {language && (
            <div>
                <h3>{language.language}</h3>
                <h6>{language.id}</h6>
                {assemblies && assemblies.map(a => (
                    <a href={`/api/assembly/${a.id}`}>{a.name}</a>
                ))}
                <button onClick={handleAssemble}>Собрать</button>
            </div>
        )}
    </>
}

export default LanguageDetails;