import FileList from "components/file/FileList";
import FilePeek from "components/file/FilePeek";
import Languages from "components/language/Languages";
import TextSegments from "components/language/LanguageTranslations";
import ProjectSummary from "components/project/ProjectSummary";
import { Navigate, Route, Routes } from "react-router-dom";
import "./ProjectPage.css"
import TabLink from "components/ui-components/TabLink";
import Actions from "components/project/Actions";

const ProjectPage: React.FC<{}> = (_) => {
    return <div className="project-page">
        <div className="project-page_nav">
            <TabLink to={'details'}>Детали</TabLink>
            <TabLink to={'languages'}>Перевод</TabLink>
            <TabLink to={'files'}>Файлы</TabLink>
            <TabLink to={'text-segments'}>Все сегменты</TabLink>
            <TabLink to={'actions'}>История изменений</TabLink>
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
                <Route path='actions' element={<Actions />} />
            </Routes>
        </div>
    </div>
}

export default ProjectPage;


