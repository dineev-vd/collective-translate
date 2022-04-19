import ProjectPieces from "components/ProjectPieces";
import ProjectSummary from "components/ProjectSummary";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import TranslatePiecePage from "./TranslatePiecePage";

const ProjectPage: React.FC<{}> = (_) => {
    return <div>
        <Link to={'details'}>Детали</Link>
        <Link to={'pieces'}>Перевод</Link>
        <Routes>
            <Route path="piece" element={<ProjectPieces />} >
                <Route path=':pieceId' element={<TranslatePiecePage />} />
            </Route>
            <Route path="details" element={<ProjectSummary />} />
            <Route index element={<Navigate to={"details"} replace />} />
        </Routes>
    </div>
}

export default ProjectPage;


