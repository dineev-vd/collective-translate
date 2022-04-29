import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { putTranslationChanges, selectTranslationChanges, selectTranslations, TranslationState } from "store/translate-piece-reducer";

const TextPiece: React.FC<{ selectedOrder: number, order: number, languageId: string, originalLanguageId: string, setScroll: Function, scroll: boolean }> = ({ selectedOrder, setScroll, scroll, order, languageId, originalLanguageId }) => {

    const [showTranslation, changeTranslation] = useState<boolean>(true);
    const spanRef = useRef<HTMLDivElement>();
    const dispatch = useDispatch();
    const prevUpdateInside = useRef<boolean>(false);
    const navigate = useNavigate();
    const translations = useSelector(selectTranslations);
    const translationChanges = useSelector(selectTranslationChanges);

    const params = useParams();
    const textSegment = useMemo(() => {
        if (languageId == originalLanguageId)
            return undefined;

        return translations[languageId] && translations[languageId].length > 0 && translations[languageId][order - translations[languageId][0].order]
    }, [order, languageId, translations]);
    const originalSegment = useMemo(() => translations[originalLanguageId] && translations[originalLanguageId].length > 0 && originalLanguageId != languageId ? translations[originalLanguageId][order - translations[originalLanguageId][0].order] : undefined, [order, originalLanguageId, translations]);



    const backgroundColor = useMemo(() => {
        if (textSegment?.id != originalSegment?.id) {
            return (order == selectedOrder ? (showTranslation ? "lightgreen" : "lightcoral") : "gray");
        }

        return null
    },
        [showTranslation, order, selectedOrder, textSegment, originalSegment]);


    function update() {
        //console.log(spanRef.current.innerText);
        dispatch(putTranslationChanges([{ id: showTranslation ? textSegment.id : originalSegment.id, translation: { translationText: spanRef.current.innerText, comment: "" } }]))

        prevUpdateInside.current = true;
    }

    useEffect(() => {
        if (!originalSegment)
            return;

        if (prevUpdateInside.current) {
            prevUpdateInside.current = false;
            return;
        }

        spanRef.current.contentEditable = "false";
        if (showTranslation && textSegment) {
            spanRef.current.innerText = textSegment?.id in translationChanges ? translationChanges[textSegment?.id]?.translationText : textSegment?.translationText
        } else {
            spanRef.current.innerText = originalSegment?.id in translationChanges ? translationChanges[originalSegment?.id]?.translationText : originalSegment?.translationText;
        }

        spanRef.current.style.backgroundColor = backgroundColor;
        //spanRef.current.style.opacity = showTranslation && !(textSegment.translationText.length > 0) ? "0.5" : "1";
        spanRef.current.contentEditable = "true";


    }, [translationChanges, prevUpdateInside.current, showTranslation, textSegment, originalSegment, order, selectedOrder])

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
        {textSegment?.id != originalSegment?.id && <button onClick={() => navigate(`/translate/${textSegment.id}`)} style={{ height: "1rem" }}></button>}
        {textSegment?.id != originalSegment?.id && <button onClick={() => changeTranslation(!showTranslation)}>#</button>}
        {originalSegment && <span
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