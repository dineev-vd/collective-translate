import ProjectPieces from "components/ProjectPieces";
import ProjectSummary from "components/ProjectSummary";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";

const ProjectPage: React.FC<{}> = (_) => {
    const { id } = useParams();

    return <div>
        <Link to={'details'}>Детали</Link>
        <Link to={'pieces'}>Перевод</Link>
        <Routes>
            <Route path="pieces" element={<ProjectPieces />} />
            <Route path="details" element={<ProjectSummary projectId={id}/>} />
            <Route path="*" element={<Navigate to={"details"} replace />} />
        </Routes>
    </div>
}

export default ProjectPage;


