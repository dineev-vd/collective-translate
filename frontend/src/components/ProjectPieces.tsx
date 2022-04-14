import { TranslatePieceDto } from "@common/dto/get-translate-piece.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";

const ProjectPieces: React.FC<{ projectId: string }> = ({ projectId }) => {
    const [pieces, setPieces] = useState<TranslatePieceDto[]>([]);

    useEffect(() => {
        api.getProjectPieces(projectId)
            .then(pieces => {
                setPieces(pieces);
            })
    }, [projectId])

    return <>
        {pieces && pieces.map(piece => (
            <div style={{display: "flex",flex:"1 1 auto", flexDirection: "row"}}>
                <div style={{width: "100%"}}>
                    Текст до:
                    <input style={{width: "100%", boxSizing: "border-box"}} value={piece.before} disabled />
                </div>
                <div style={{width: "100%"}}>
                    Текст после:
                    <input style={{width: "100%", boxSizing: "border-box"}} value={piece.after} disabled />
                </div>
            </div>
        ))}
    </>
}

export default ProjectPieces;