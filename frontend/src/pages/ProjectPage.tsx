import FileList from "components/FileList";
import FilePeek from "components/FilePeek";
import Languages from "components/Languages";
import TextSegments from "components/LanguageTranslations";
import ProjectSummary from "components/ProjectSummary";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import TranslationPage from "./TranslatePiecePage";
import "./ProjectPage.css"
import TabLink from "components/TabLink";

const ProjectPage: React.FC<{}> = (_) => {
    return <div className="project-page">
        <div className="project-page_nav">
            <TabLink to={'details'}>Детали</TabLink>
            <TabLink to={'languages'}>Перевод</TabLink>
            <TabLink to={'files'}>Файлы</TabLink>
            <TabLink to={'text-segments'}>Все сегменты</TabLink>
        </div>
        <div className="project-page_content">
            <Routes>
                <Route path="languages/*" element={<Languages />} />
                <Route path='files' element={<FileList />} >
                    <Route path=':fileId' element={<FilePeek />} />
                </Route>
                <Route path='text-segments' element={<TextSegments />} />
                <Route path="details" element={<ProjectSummary />} />
                <Route index element={<Navigate to={"details"} replace />} />
            </Routes>
        </div>
    </div>
}

export default ProjectPage;


