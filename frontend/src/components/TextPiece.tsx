import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { putTranslationChanges, selectTranslationChanges, selectTranslations, TranslationState } from "store/translate-piece-reducer";

const TextPiece: React.FC<{ selectedOrder: number, order: number, languageId: string, original: string, setScroll: Function, scroll: boolean }> = ({ selectedOrder, setScroll, scroll, order, languageId, original }) => {

    const [showTranslation, changeTranslation] = useState<boolean>(true);
    const spanRef = useRef<HTMLDivElement>();
    const dispatch = useDispatch();
    const prevUpdateInside = useRef<boolean>(false);
    const navigate = useNavigate();
    const translations = useSelector(selectTranslations);
    const translationChanges = useSelector(selectTranslationChanges);

    const params = useParams();
    const textSegment = useMemo(() => {
        return translations[languageId] && translations[languageId].length > 0 && translations[languageId][order - translations[languageId][0].order]
    }, [order, languageId, translations]);
    const originalSegment = useMemo(() => translations[original] && translations[original].length > 0 && original != languageId ? translations[original][order - translations[original][0].order] : undefined, [order, original, translations]);



    const backgroundColor = useMemo(() => {
        if (originalSegment) {
            return showTranslation ? "lightblue" : (order == selectedOrder ? "lightgreen" : "lightcoral");
        }

        return null
    },
        [showTranslation, originalSegment, order, selectedOrder]);


    function update() {
        //console.log(spanRef.current.innerText);
        dispatch(putTranslationChanges([{ id: showTranslation ? textSegment.id : originalSegment.id, translation: { translationText: spanRef.current.innerText, comment: "" } }]))

        prevUpdateInside.current = true;
    }

    useEffect(() => {
        if (!textSegment)
            return;

        if (prevUpdateInside.current) {
            prevUpdateInside.current = false;
            return;
        }

        spanRef.current.contentEditable = "false";
        if (showTranslation) {
            spanRef.current.innerText = textSegment?.id in translationChanges ? translationChanges[textSegment?.id]?.translationText : textSegment?.translationText
        } else if (originalSegment) {
            spanRef.current.innerText = originalSegment?.id in translationChanges ? translationChanges[originalSegment?.id]?.translationText : originalSegment?.translationText;
        }

        spanRef.current.style.backgroundColor = backgroundColor;
        spanRef.current.style.opacity = showTranslation && !(textSegment.translationText.length > 0) ? "0.5" : "1";
        spanRef.current.contentEditable = "true";


    }, [translationChanges, prevUpdateInside.current, showTranslation, textSegment, originalSegment])

    useEffect(() => {
        if (scroll && order == selectedOrder && spanRef.current) {
            spanRef.current.scrollIntoView()
        }

        setScroll();
    }, [scroll, spanRef.current])

    useEffect(() => {
        //console.log(translation?.id)
        //console.log(translationId)
    }, [translations])

    return <span>
        {textSegment && <button onClick={() => navigate(`/translate/${textSegment.id}`)} style={{ height: "1rem" }}></button>}
        {originalSegment && textSegment && <button onClick={() => changeTranslation(!showTranslation)}>#</button>}
        {textSegment && <span
            defaultValue={showTranslation ? textSegment.translationText : originalSegment.translationText}
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={_ => update()}
            ref={spanRef}
            style={{
                outline: 0,
                whiteSpace: "pre-wrap"
            }}
        />}
    </span>
}

export default TextPiece;