import { api } from "api/Api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { putTranslations, selectTranslations } from "store/translate-piece-reducer";
import TextSegmentDisplay from "./TextSegmentDisplay";

enum Direction {
    UP = 0,
    DOWN = 1
}

const TextDisplay: React.FC<{ segmentId: string }> = ({ segmentId }) => {

    const dispatch = useDispatch();
    const translations = useSelector(selectTranslations);

    const segment = useMemo(() => translations[segmentId], [translations, segmentId]);

    const upperTriggerRef = useRef();
    const lowerTriggerRef = useRef();

    const [segmentDisplayArray, setDisplayArray] = useState<Partial<Record<'segmentId' | 'originalSegmentId', string>>[]>([]);

    useEffect(() => {
        if (!(segmentId in translations)) {
            api.getTextSegment(segmentId, { withOriginal: true }).then(([respone, _]) => {
                dispatch(putTranslations(respone));
            })
        }
    }, [segmentId])

    useEffect(() => {
        if (!segment)
            return;

        if (segmentDisplayArray.find(info => (segment.id === info.segmentId) || (segment.id === info.originalSegmentId)))
            return;

        setDisplayArray([{ segmentId: segment.id, originalSegmentId: segment.originalSegmentId }]);
    }, [segment])

    function expand(direction: Direction) {
        const upperBorderSegment = segmentDisplayArray[0];
        const lowerBorderSegment = segmentDisplayArray[segmentDisplayArray.length - 1];

        const segmentsPromise = direction === Direction.UP ?
            api.getTextSegment(
                upperBorderSegment.segmentId ? upperBorderSegment.segmentId : upperBorderSegment.originalSegmentId,
                {
                    prevMinLength: 50,
                    withOriginal: true,
                    toLanguageId: upperBorderSegment.segmentId ? undefined : segment.translationLanguageId
                }
            ) :
            api.getTextSegment(
                lowerBorderSegment.segmentId ? lowerBorderSegment.segmentId : lowerBorderSegment.originalSegmentId,
                {
                    nextMinLength: 50,
                    withOriginal: true,
                    toLanguageId: lowerBorderSegment.segmentId ? undefined : segment.translationLanguageId
                }
            )

        segmentsPromise.then(([response, _]) => {
            const ids = response.map(segment => ({ segmentId: segment.id, originalSegmentId: segment.original.id }));
            if (direction === Direction.DOWN) {
                setDisplayArray(prevArrayState => [...prevArrayState, ...ids]);
            } else {
                setDisplayArray(prevArrayState => [...ids, ...prevArrayState]);
            }

            dispatch(putTranslations(response));
        })
    }


    return <div>
        {segmentDisplayArray.length > 0 &&
            <>
                <button onClick={() => expand(Direction.UP)}>Вверх</button>
                <div ref={upperTriggerRef} id="upper-trigger" />
                {segmentDisplayArray.map(displaySegmentId => (
                    <TextSegmentDisplay
                        key={displaySegmentId.originalSegmentId}
                        segmentId={displaySegmentId.segmentId}
                        originalSegmentId={displaySegmentId.originalSegmentId}
                    />
                ))}
                <div ref={lowerTriggerRef} id="lower-trigger" />
                <button onClick={() => expand(Direction.DOWN)}>Вниз</button>
            </>}
    </div>
}

export default TextDisplay;