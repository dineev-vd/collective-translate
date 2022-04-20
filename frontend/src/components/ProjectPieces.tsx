import { GetTranslatePieceDto } from "@common/dto/translate-piece.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ProjectPieces: React.FC<{}> = () => {
    const { projectId } = useParams();
    const [pieces, setPieces] = useState<GetTranslatePieceDto[]>([]);

    useEffect(() => {
        api.getProjectPieces(projectId)
            .then(([pieces, _]) => {
                setPieces(pieces);
            })
    }, [projectId])

    return <>
        {pieces && pieces.map(piece => (
            <div style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", border: "1px solid black", borderRadius: "10px" }}>
                
                <Link to={piece.id.toString()}><h4>Перейти</h4></Link>
                <div style={{ width: "100%" }}>
                    Текст до:
                    <input style={{ width: "100%", boxSizing: "border-box" }} value={piece.before} disabled />
                </div>
                <div style={{ width: "100%" }}>
                    Текст после:
                    <input style={{ width: "100%", boxSizing: "border-box" }} value={piece.after} disabled />
                </div>
            </div>
        ))}
    </>
}

export default ProjectPieces;