import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectTranslations } from "store/translate-piece-reducer";

const TextSegmentDisplay: React.FC<{ segmentId: string, originalSegmentId: string }> = ({ segmentId, originalSegmentId }) => {
    const [showOriginal, setShowOriginal] = useState<Boolean>(false);
    const translations = useSelector(selectTranslations);
    const navigate = useNavigate();

    const navigateToSegment = useCallback(() => {
        navigate(`../translate/${!showOriginal ? segmentId ?? originalSegmentId : originalSegmentId ?? segmentId}`)
    }, [segmentId, originalSegmentId, showOriginal]);

    return <div>
        <button onClick={() => navigateToSegment()}>К сегменту</button>
        {segmentId && <button onClick={() => setShowOriginal(prev => !prev)}>#</button>}
        {!showOriginal ?
            (translations[segmentId] ? translations[segmentId].translationText : "отсутствует") :
            translations[originalSegmentId] ? translations[segmentId].translationText : "отсутствует"}
    </div>
}

export default TextSegmentDisplay;