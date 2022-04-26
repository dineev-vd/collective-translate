import FileList from "components/FileList";
import Languages from "components/Languages";
import LanguageTranslations from "components/LanguageTranslations";
import ProjectSummary from "components/ProjectSummary";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import TranslationPage from "./TranslatePiecePage";

const ProjectPage: React.FC<{}> = (_) => {
    return <div>
        <Link to={'details'}>Детали</Link>
        <Link to={'languages'}>Перевод</Link>
        <Link to={'files'}>Файлы</Link>
        <Routes>
            <Route path="languages" element={<Languages />} />
            <Route path="languages/:languageId" element={<Navigate to={'pieces'} />} />
            <Route path="languages/:languageId/pieces" element={<LanguageTranslations />} />
            <Route path='languages/:languageId/pieces/:translationId' element={<TranslationPage />} />
            <Route path='files/*' element={<FileList />} />
            <Route path="details" element={<ProjectSummary />} />
            <Route index element={<Navigate to={"details"} replace />} />
        </Routes>
    </div>
}

export default ProjectPage;


