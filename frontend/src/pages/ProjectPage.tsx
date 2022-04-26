import FileList from "components/FileList";
import FilePeek from "components/FilePeek";
import Languages from "components/Languages";
import TextSegments from "components/LanguageTranslations";
import ProjectSummary from "components/ProjectSummary";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import TranslationPage from "./TranslatePiecePage";

const ProjectPage: React.FC<{}> = (_) => {
    return <div>
        <Link to={'details'}>Детали</Link>
        <Link to={'languages'}>Перевод</Link>
        <Link to={'files'}>Файлы</Link>
        <Link to={'text-segments'}>Все сегменты</Link>
        <Routes>
            <Route path="languages" element={<Languages />} />
            {/* <Route path="languages/:languageId/pieces" element={<LanguageTranslations />} /> */}
            {/* <Route path='languages/:languageId/pieces/:translationId' element={<TranslationPage />} /> */}
            <Route path='files' element={<FileList />} >
                <Route path=':fileId' element={<FilePeek />} />
            </Route>
            <Route path='text-segments' element={<TextSegments />} />
            <Route path="details" element={<ProjectSummary />} />
            <Route index element={<Navigate to={"details"} replace />} />
        </Routes>
    </div>
}

export default ProjectPage;


