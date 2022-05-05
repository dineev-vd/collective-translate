import { GetTranslationDto } from "common/dto/translate-piece.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SegmentSplit from "./SegmentSplit";
import "./LanguageSegments.css"
import { GetActionDto } from "common/dto/action.dto";

const LanguageSegments: React.FC = () => {
    const { languageId } = useParams();
    const [segments, setSegments] = useState<GetTranslationDto[]>([]);
    const [actions, setActions] = useState<GetActionDto[]>();
    const [selectedId, setSelectedId] = useState<string>();

    useEffect(() => {
        api.getTranslationsByLanguage(languageId, { shouldTranslate: true, withOriginal: true }).then(([response, _]) => {
            setSegments(response);
        })
    }, [languageId])

    useEffect(() => {
        api.getActions(+selectedId).then(([response, _]) => {
            setActions(response);
        })
    }, [selectedId])



    return <div className="language-segments">
        <div className="language-segments_left">
            {segments.map(segment => (
                <div onClick={() => setSelectedId(segment.id)} className={`language-segments_wrapper ${segment.id == selectedId ? "language-segments__selected" : ""}`}>
                    <SegmentSplit segment={segment} />
                </div>
            ))}
        </div>
        <div className="language-segments_right">
            {actions ? (
                <>
                    <h3>История изменений: </h3>
                    {actions.map(edit =>
                        <div key={edit.id}>
                            {edit.author && <div>
                                <h5>Автор:</h5>
                                <Link to={`/profile/${edit.author.id}`}> {edit.author.name} </Link>
                            </div>}
                            <h5>Изменение:</h5>
                            {edit.change}
                            {edit.comment && <div>
                                <h5>Заметка:</h5>
                                {edit.comment}
                            </div>}
                        </div>
                    )}
                </>
            ) : <h3>Выберите сегмент для просмотра истории</h3>}
        </div>
    </div>
}

export default LanguageSegments;