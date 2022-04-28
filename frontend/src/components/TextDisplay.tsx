import { GetActionDto, PostActionDto } from "@common/dto/action.dto";
import { GetTranslationDto } from "@common/dto/translate-piece.dto";
import { api } from "api/Api";
import { fchownSync } from "fs";
import { UIEvent, UIEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { appendTranslations, clearTranslations, prependTranslations, putTranslationChanges, putTranslations, selectTranslationChanges, selectTranslations } from "store/translate-piece-reducer";
import { isConstructorDeclaration } from "typescript";
import TextPiece from "./TextPiece";

const TextDisplay: React.FC<{ languageId: string, order: number, original: string }> = ({ languageId, order, original }) => {
    // const translations = useSelector(selectTranslations);
    // const textSegments = useSelector(selectTextSegments);

    const t = useSelector(selectTranslations);
    const translations = useMemo(() => t[languageId], [languageId, t]);

    // Store
    const dispatch = useDispatch();

    // Util
    const divRef = useRef<HTMLDivElement>();
    const updating = useRef<boolean>(false)
    const once = useRef<boolean>(false);
    const [scroll, setScroll] = useState<boolean>(false);
    const pos = useRef<number>(0);
    const scrollToTop = useRef<number>(0);
    const upper = useRef<Boolean>(false);

    const upperEndRef = useRef();
    const lowerEndRef = useRef();


    const expandDown = useCallback(async () => {
        if (updating.current || !translations) return;
        updating.current = true;

        const start = translations[translations.length - 1];
        const startIndex = start.order;



        api.getTextSegment(languageId, startIndex + 1, { nextMinLength: 50 }).then(([response, _]) => {
            dispatch(putTranslations({ translations: response, language: languageId }))
        }).catch(() => updating.current = false)

        if (original != languageId)
            api.getTextSegment(original, startIndex + 1, { nextMinLength: 50 }).then(([response, _]) => {
                dispatch(putTranslations({ translations: response, language: original }))
            })

    }, [translations])

    const expandUp = useCallback(async () => {
        if (updating.current || !translations) return;
        updating.current = true;

        const start = translations[0];
        const startIndex = start.order;

        if (start.order === 0) {
            updating.current = false
            return;
        }

        // TODO: make file have max order
        // if (start.order) {
        //     updating.current = false
        //     canGoUp.current = false
        //     return;
        // }



        api.getTextSegment(languageId, startIndex - 1, { prevMinLength: 50 }).then(([response, _]) => {
            dispatch(putTranslations({ translations: response, language: languageId }))
        }).catch(() => updating.current = false)

        if (original != languageId)
            api.getTextSegment(original, startIndex - 1, { prevMinLength: 50 }).then(([response, _]) => {
                dispatch(putTranslations({ translations: response, language: original }))
            })
    }, [translations])


    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (e.target.id == 'upper') {
                    console.log('upper')
                    const toTop = divRef.current.scrollHeight - divRef.current.scrollTop - divRef.current.clientHeight;
                    upper.current = true;
                    scrollToTop.current = toTop;
                    expandUp().catch(() => updating.current = false);
                }

                if (e.target.id == 'lower') {
                    expandDown().catch(() => updating.current = false);
                }
            }
        })
    }, [expandUp, expandDown]);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };

        const observer = new IntersectionObserver(handleObserver, option);
        observer.observe(upperEndRef.current);
        observer.observe(lowerEndRef.current);

        return () => observer.disconnect();


    }, [handleObserver]);

    useEffect(() => {
        if (upper.current || scroll) {
            divRef.current.scrollTop = divRef.current.scrollHeight - scrollToTop.current - divRef.current.clientHeight;
        }

        upper.current = false;
        updating.current = false;
    }, [translations])

    return <div ref={divRef} style={{ width: "100%", bottom: 0, height: "90vh", overflowY: "scroll", whiteSpace: "pre-wrap", position: "relative" }} >
        <div id='upper' ref={upperEndRef}></div>
        {translations && translations.map((value, index) => {
            return <TextPiece scroll={scroll} setScroll={index < translations.length - 1 ? () => { } : () => {
                setScroll(true);
            }} key={value.id.toString()} selectedOrder={order} order={value.order} languageId={languageId} original={original} />;
        })}
        <div id='lower' ref={lowerEndRef}></div>
    </div>
}

export default TextDisplay;