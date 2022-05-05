import { GetProjectDto } from "common/dto/project.dto";
import { Link } from "react-router-dom";
import "./ProjectSmall.css";

const ProjectSmall: React.FC<{project: GetProjectDto}> = ({project}) => {
    return <div className="project-small">
            <div><Link to={`/project/${project.id}`}>{project.name}</Link></div>
            <div>{project.description}</div>
        </div>
}

export default ProjectSmall;