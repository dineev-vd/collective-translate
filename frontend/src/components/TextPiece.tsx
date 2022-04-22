import { GetTextSegmentDto } from "@common/dto/text-piece.dto";
import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { putTextChanges, selectTextChanges, selectTextSegments, TextSegmentState } from "store/text-segment-reducer";
import { putTranslationChanges, selectTranslationChanges, selectTranslations, TranslationState } from "store/translate-piece-reducer";

const TextPiece: React.FC<{ value: TextSegmentState, setScroll: Function, scroll: boolean }> = ({ value, setScroll, scroll }) => {

    const [showTranslation, changeTranslation] = useState<boolean>(false);
    const { translationId, languageId } = useParams();
    const spanRef = useRef<HTMLDivElement>();
    const dispatch = useDispatch();
    const prevUpdateInside = useRef<boolean>(false);
    const navigate = useNavigate();
    const textSegments = useSelector(selectTextSegments);
    const translations = useSelector(selectTranslations);
    const translation = useMemo(() => translations[value.translationIds[Number(languageId)]], [translations, value])
    const translationChanges = useSelector(selectTranslationChanges);
    const textChanges = useSelector(selectTextChanges);

    const backgroundColor = useMemo(() => {
        if (value.shouldTranslate && translation) {
            return showTranslation ? "lightblue" : (Number(translationId) == translation.id ? "lightgreen" : "lightcoral");
        }

        return null
    },
        [showTranslation, value.shouldTranslate, translationId, translation ? translation.id : null]);


    function update() {
        console.log(spanRef.current.innerText);

        if (showTranslation) {
            dispatch(putTranslationChanges([{ id: translation.id, translation: { translationText: spanRef.current.innerText, comment: "" } }]))
        } else {
            dispatch(putTextChanges([{ id: value.id, textSegment: { text: spanRef.current.innerText, comment: "" } }]))
        }

        prevUpdateInside.current = true;
    }

    useEffect(() => {
        if (prevUpdateInside.current) {
            prevUpdateInside.current = false;
            return;
        }

        spanRef.current.contentEditable = "false";
        if (showTranslation) {
            spanRef.current.innerText = translationChanges[translation.id] ? translationChanges[translation.id].translationText : (translation.translationText.length > 0 ? translation.translationText : "Пока не переведено")
        } else {
            spanRef.current.innerText = textChanges[value.id] ? textChanges[value.id].text : value.text;

        }

        spanRef.current.style.backgroundColor = backgroundColor;
        spanRef.current.style.opacity = showTranslation && !(translation.translationText.length > 0) ? "0.5" : "1";
        spanRef.current.contentEditable = "true";


    }, [translationId, translationChanges, textChanges, prevUpdateInside.current, showTranslation, value, value.shouldTranslate && (translation ? translation.translationText : null)])

    useEffect(() => {
        if (scroll && Number(translationId) == value.id) {
            spanRef.current.scrollIntoView({ behavior: "smooth" })
        }

        setScroll();
    }, [scroll])

    useEffect(() => {
        console.log(translation?.id)
        console.log(translationId)
    }, [translations, translation?.id])

    return <span>
        {value.shouldTranslate && <button onClick={() => navigate(`../languages/${languageId}/pieces/${translation.id}`)} style={{ height: "1rem" }}></button>}
        {value.shouldTranslate && translation && <button onClick={() => changeTranslation(!showTranslation)}>#</button>}
        <span
            defaultValue={showTranslation ? (translation.translationText.length > 0 ? translation.translationText : "Пока не переведено") : value.text}
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={_ => update()}
            ref={spanRef}
            style={{
                outline: 0,
                whiteSpace: "pre-wrap"
            }}
        />
    </span>
}

export default TextPiece;