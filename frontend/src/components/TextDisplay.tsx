import { GetActionDto, PostActionDto } from "@common/dto/action.dto";
import { api } from "api/Api";
import { fchownSync } from "fs";
import { UIEvent, UIEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { addTranslations, putTextChanges, putTextSegments, selectTextChanges, selectTextSegments, TextSegmentState } from "store/text-segment-reducer";
import { clearTranslations, putTranslationChanges, putTranslations, selectTranslationChanges, selectTranslations } from "store/translate-piece-reducer";
import { setTokenSourceMapRange } from "typescript";
import TextPiece from "./TextPiece";

const TextDisplay: React.FC = () => {
    const params = useParams();
    const translations = useSelector(selectTranslations);
    const textSegments = useSelector(selectTextSegments);
    const textSegmentId = Number(params.textSegmentId);

    const dispatch = useDispatch();
    const divRef = useRef<HTMLDivElement>();
    const updating = useRef<boolean>(false)
    const once = useRef<boolean>(false);
    const [scroll, setScroll] = useState<boolean>(false);
    const pos = useRef<number>(0);
    const canGoUp = useRef<boolean>(true);

    const [text, setText] = useState<{ id: number, order: number }[]>([]);

    const [actions, setActions] = useState<GetActionDto[]>();

    const translationChanges = useSelector(selectTranslationChanges);
    const textChanges = useSelector(selectTextChanges);

    const [query, setQuery] = useSearchParams();
    const languageId = useMemo(() => Number(query.get('languageId')), [query]);
    const translationId = useMemo(() => textSegments[textSegmentId]?.translationIds[languageId], [textSegmentId, textSegments, languageId])



    function expandDown() {
        if (updating.current) return;
        updating.current = true;

        const startIndex = text[text.length - 1].id;

        if (!startIndex) {
            updating.current = false
            return;
        }

        api.getTextSegment(startIndex, { nextMinLength: 50 }).then(([response, _]) => {
            dispatch(putTextSegments(response.map(segment => ({ ...segment, translationIds: {} }))))
        }).catch(() => updating.current = false)

    }

    function expandUp() {
        if (updating.current) return;
        updating.current = true;

        const startIndex = text[0].id;

        if (!startIndex) {
            updating.current = false
            canGoUp.current = false
            return;
        }

        api.getTextSegment(startIndex, { prevMinLength: 50 }).then(([response, _]) => {
            dispatch(putTextSegments(response.map(segment => ({ ...segment, translationIds: {} }))))
        }).catch(() => updating.current = false)
    }

    useEffect(() => {
        api.getActions(textSegmentId, languageId).then(([response, _]) => {
            setActions(response);
        })
    }, [textSegmentId, languageId])


    useEffect(() => {
        if (!textSegmentId)
            return;
        // Check if our `TextPiece` is already loaded.
        // If not - fetch it.
        if (!(textSegmentId in textSegments)) {
            api.getTextSegment(textSegmentId, { nextMinLength: 50, prevMinLength: 50 }).then(([response, _]) => {
                dispatch(putTextSegments(response.map(segment => ({ ...segment, translationIds: {} }))));
            })

            return;
        }

    }, [textSegmentId]);

    useEffect(() => {
        dispatch(clearTranslations());
    }, [languageId])

    useEffect(() => {
        setText(Object.values(textSegments).map(segment => ({ id: segment.id, order: segment.order })).sort((a, b) => a.order - b.order));
        if (!languageId)
            return;



        const missingTranslations = Object.values(textSegments).filter(segment => segment.shouldTranslate && !segment.translationIds[languageId]).map(segment => Number(segment.id));
        if (missingTranslations.length > 0) {
            api.getTranslations({ languageId: languageId.toString(), textSegmentsIds: missingTranslations }).then(([response, _]) => {
                dispatch(putTranslations(response.map(translation => ({ id: translation.id, translation: translation }))));
                dispatch(addTranslations(response.map(translation => ({ languageId: languageId, textSegmentId: translation.textSegmentId, translationId: translation.id }))));
            })

            return;
        }
    }, [textSegments, languageId])

    function handleScroll(event) {
        const e = divRef.current;
        //console.log(e.scrollTop);


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

    const handleSubmit = (e) => {
        e.preventDefault();
        const textChange = textChanges[textSegmentId];
        const translationChange = translationChanges[translationId];

        let arr: PostActionDto[] = [];
        if (textChange) {
            arr.push({ change: textChange.text, textSegmentId: textSegmentId, comment: '' })
        }

        if (translationChange) {
            arr.push({ languageId: Number(languageId), textSegmentId: textSegmentId, change: translationChange.translationText, comment: '' })
        }

        api.postActions(arr).then(() => {
            window.location.reload();
        })
    }

    return <div style={{ display: "flex", flexDirection: "row", flex: "1 1 auto" }}>
        <div style={{ width: "100%" }}>
            <>
                <form onSubmit={(e) => handleSubmit(e)}>

                    {textSegmentId in textSegments &&
                        <div>
                            <h3>Перевод до:</h3>
                            <textarea onChange={e => dispatch(putTextChanges([{ id: textSegmentId, textSegment: { comment: "", text: e.target.value } }]))}
                                value={textSegmentId in textChanges ? textChanges[textSegmentId].text : textSegments[textSegmentId].text} />
                        </div>}

                    {translationId && translationId in translations && <div>
                        <h3>Перевод после:</h3>
                        <textarea onChange={e => dispatch(putTranslationChanges([{ id: translationId, translation: { translationText: e.target.value, comment: "" } }]))}
                            value={translationId in translationChanges ? translationChanges[translationId].translationText : translations[translationId].translationText} />
                    </div>}
                    <button type="submit">Отправить измеения</button>
                </form>

            </>
            {actions && (
                <>
                    <h3>История изменений: </h3>
                    {actions.map(edit =>
                        <div>
                            <h5>Автор:</h5>
                            {/* <Link to={`/profile/${edit.author.id}`}> {edit.author.name} </Link> */}
                            <h5>Изменение:</h5>
                            {edit.change}
                            <h5>Заметка:</h5>
                            {edit.comment}
                        </div>
                    )}
                </>
            )}

        </div>


        <div onScroll={e => handleScroll(e)} ref={divRef} style={{ width: "100%", bottom: 0, height: "90vh", overflowY: "scroll", whiteSpace: "pre-wrap", position: "relative" }} >
            {text && text.map((value, index) => {
                return <TextPiece scroll={scroll} setScroll={index < text.length - 1 ? () => { } : () => {
                    setScroll(true);
                }} key={value.id.toString()} id={value.id} />;
            })}
        </div>
    </div>
}

export default TextDisplay;