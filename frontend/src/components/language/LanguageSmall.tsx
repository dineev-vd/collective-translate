import { GetTranslateLanguage } from "common/dto/language.dto";
import { Link } from "react-router-dom";
import "./LanguageSmall.css"

const LanguageSmall: React.FC<{ language: GetTranslateLanguage }> = ({ language }) => {
    return <div className="language-small">
        <div>
            <Link to={`${language.id}`}>{language.language}</Link>
            <Link to={`/languages/${language.id}`}>Перейти к сегментам</Link>
        </div>
        {language.original ? <div className="language-small__original">
            {"Оригинал"}
        </div> : null}
    </div>
}

export default LanguageSmall;