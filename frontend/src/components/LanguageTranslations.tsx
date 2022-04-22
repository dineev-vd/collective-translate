import { GetTranslateLanguage } from "@common/dto/language.dto";
import { GetTranslationDto } from "@common/dto/translate-piece.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const LanguageTranslations: React.FC<{}> = () => {
    const { languageId } = useParams();
    const [translation, setTranslation] = useState<GetTranslateLanguage>();

    useEffect(() => {
        api.getLanguage(Number(languageId))
            .then(([translation, _]) => {
                setTranslation(translation);
            })
    }, [languageId])

    return <>
        {translation && translation.translationSegments.map(segment => (
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