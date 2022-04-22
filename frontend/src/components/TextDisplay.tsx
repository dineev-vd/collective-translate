import { api } from "api/Api";
import { fchownSync } from "fs";
import { UIEvent, UIEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addTranslations, putTextSegments, selectTextSegments, TextSegmentState } from "store/text-segment-reducer";
import { putTranslations, selectTranslations } from "store/translate-piece-reducer";
import { setTokenSourceMapRange } from "typescript";
import TextPiece from "./TextPiece";

const TextDisplay: React.FC = () => {
    const params = useParams();
    const translationId = Number(params.translationId)
    const languageId = Number(params.languageId)
    const translations = useSelector(selectTranslations);
    const textSegments = useSelector(selectTextSegments);
    const [text, setText] = useState<TextSegmentState[]>([]);
    const dispatch = useDispatch();
    const divRef = useRef<HTMLDivElement>();
    const updating = useRef<boolean>(false)
    const once = useRef<boolean>(false);
    const [scroll, setScroll] = useState<boolean>(false);
    const pos = useRef<number>(0);
    const canGoUp = useRef<boolean>(true);


    function expandDown() {
        if (updating.current) return;
        updating.current = true;

        const startIndex = text[text.length - 1].nextId;

        if (!startIndex) {
            updating.current = false
            return;
        }

        api.getTextSegment(startIndex, { nextMinLength: 3000 }).then(([response, _]) => {
            dispatch(putTextSegments(response.map(segment => ({ ...segment, translationIds: {} }))))
        }).catch(() => updating.current = false)

    }

    function expandUp() {
        if (updating.current) return;
        updating.current = true;

        const startIndex = text[0].previousId;

        if (!startIndex) {
            updating.current = false
            canGoUp.current = false
            return;
        }

        api.getTextSegment(startIndex, { prevMinLength: 3000 }).then(([response, _]) => {
            dispatch(putTextSegments(response.map(segment => ({ ...segment, translationIds: {} }))))
        }).catch(() => updating.current = false)
    }

    useEffect(() => {
        const { textSegmentId } = translations[translationId];
        const centerPiece = textSegments[textSegmentId];

        if (!centerPiece)
            return;

        let arr = [centerPiece];

        let prevPiece = textSegments[centerPiece.previousId];
        let prevArr = [];
        while (prevPiece) {
            prevArr = [...prevArr, prevPiece]
            prevPiece = textSegments[prevPiece.previousId]
        }
        arr = prevArr.reverse().concat(arr);

        let nextPiece = textSegments[centerPiece.nextId];
        while (nextPiece) {
            arr = [...arr, nextPiece]
            nextPiece = textSegments[nextPiece.nextId]
        }



        setText(arr);
    }, [textSegments])

    useEffect(() => {
        const { textSegmentId } = translations[translationId];

        // Check if our `TextPiece` is already loaded.
        // If not - fetch it.
        if (!(textSegmentId in textSegments)) {
            api.getTextSegment(textSegmentId, { nextMinLength: 5000, prevMinLength: 5000 }).then(([response, _]) => {
                dispatch(putTextSegments(response.map(segment => ({ ...segment, translationIds: {} }))));
            })

            return;
        }





    }, [translationId]);

    useEffect(() => {
        const missingTranslations = Object.values(textSegments).filter(segment => segment.shouldTranslate && !segment.translationIds[languageId]).map(segment => Number(segment.id));

        if (missingTranslations.length > 0) {
            api.getTranslations({ languageId: languageId, textSegmentsIds: missingTranslations }).then(([response, _]) => {
                dispatch(putTranslations(response.map(translation => ({ id: translation.id, translation: translation }))));
                dispatch(addTranslations(response.map(translation => ({ languageId: languageId, textSegmentId: translation.textSegmentId, translationId: translation.id }))));
            })

            return;
        }
    }, [textSegments])

    function handleScroll(event) {
        const e = divRef.current;
        console.log(e.scrollTop);
        

        const toTop = e.scrollHeight - e.scrollTop - e.clientHeight

        if (toTop >= 10 && e.scrollTop >= 10) {
            pos.current = toTop;
            if (!once.current) {
                once.current = true;
            }
        }


        if (e.scrollTop < 10) {
            if (once.current && canGoUp.current)
                divRef.current.scrollTop = e.scrollHeight - pos.current - e.clientHeight;

            expandUp()
        }

        if (toTop < 10) {
            expandDown()
        }
    }

    useEffect(() => {
        updating.current = false;
    }, [textSegments])

    return <div onScroll={e => handleScroll(e)} ref={divRef} style={{ width: "100%", bottom: 0, height: "90vh", overflowY: "scroll", whiteSpace: "pre-wrap", position: "relative" }} >
        {text && text.map((value, index) => {
            return <TextPiece scroll={scroll} setScroll={index < text.length - 1 ? () => { } : () => {
                setScroll(true);
            }} key={value.id.toString()} value={value} />;
        })}
    </div>
}

export default TextDisplay;