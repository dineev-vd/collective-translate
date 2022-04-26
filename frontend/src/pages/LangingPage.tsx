import { useNavigate } from "react-router-dom";
import "./LandingPage.css"

const LandingPage: React.FC<{}> = (_) => {
    const navigate = useNavigate();

    return <div className="landing-page">
        <div className="landing-page_wrapper">
            <button onClick={() => navigate('/project/create')} className="landing-page_create-button">Создать проект</button>
            <div className="landing-page_or">ИЛИ</div>
            <input placeholder="Найти..." className="landing-page_search"></input>
        </div>
    </div>
}

export default LandingPage;