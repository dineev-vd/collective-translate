import { GetTranslationDto } from "@common/dto/translate-piece.dto";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { putTranslationChanges, selectTranslationChanges } from "store/translate-piece-reducer";
import "./SegmentSplit.css";

const SegmentSplit: React.FC<{ segment: GetTranslationDto }> = ({ segment }) => {
    const translationChanges = useSelector(selectTranslationChanges);
    const dispatch = useDispatch();

    const translation = useMemo(() => segment.id in translationChanges ? translationChanges[segment.id].translationText : segment.translationText, [segment, translationChanges]);
    const original = useMemo(() => segment.original ? segment.original.id in translationChanges ? translationChanges[segment.original.id].translationText : segment.original.translationText : undefined, [segment, translationChanges]);

    const handleSegmentChange = (value: string) => {
        dispatch(putTranslationChanges([{ id: segment.id, translation: { id: +segment.id, comment: "", translationText: value } }]))
    }

    const handleOriginalChange = (value: string) => {
        dispatch(putTranslationChanges([{ id: segment.original?.id, translation: { id: +segment.original?.id, comment: "", translationText: value } }]))
    }

    return <div className="segment-split">
        {segment.original && <div className="segment-split_part">
            <div>Оригинал</div>
            {/* <Link to={`/segments/${segment.original.id}`}>Открыть в контексте</Link> */}
            <textarea
                disabled
                className={`segment-split_textarea ${segment.original.id in translationChanges ? 'segment-split__uncommited-change' : ''}`}
                onChange={e => handleOriginalChange(e.currentTarget.value)}
                value={original}
            />
        </div>}
        <div className="segment-split_part">
            <div>Сегмент</div>
            <Link to={`/segments/${segment.id}`}>Открыть в контексте</Link>
            <textarea
                className={`segment-split_textarea ${segment.id in translationChanges ? 'segment-split__uncommited-change' : ''}`}
                onChange={e => handleSegmentChange(e.currentTarget.value)}
                value={translation}
            />
        </div>      
    </div>
}

export default SegmentSplit;