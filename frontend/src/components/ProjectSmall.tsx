import { GetProjectDto } from "@common/dto/get-project.dto";
import { Link } from "react-router-dom";
import "./ProjectSmall.css";

const ProjectSmall: React.FC<{project: GetProjectDto}> = ({project}) => {
    return <div className="project-small">
            <h3><Link to={`/project/${project.id}`}>{project.name}</Link></h3>
            <h5>{project.description}</h5>
        </div>
}

export default ProjectSmall;