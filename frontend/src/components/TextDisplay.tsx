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

const TextDisplay: React.FC<{ languageId: string, order: number, originalLanguageId: string }> = ({ languageId, order, originalLanguageId }) => {
    // const translations = useSelector(selectTranslations);
    // const textSegments = useSelector(selectTextSegments);

    const t = useSelector(selectTranslations);
    const originalTranslations = useMemo(() => t[originalLanguageId], [originalLanguageId, t]);
    const translations = useMemo(() => t[languageId], [languageId, t]);

    // Store
    const dispatch = useDispatch();

    // Util
    const divRef = useRef<HTMLDivElement>();
    const updatingUp = useRef<boolean>(false)
    const updatingDown = useRef<boolean>(false)
    const once = useRef<boolean>(false);
    const [scroll, setScroll] = useState<boolean>(false);
    const pos = useRef<number>(0);
    const scrollToTop = useRef<number>(0);
    const upper = useRef<Boolean>(false);

    const upperEndRef = useRef();
    const lowerEndRef = useRef();

    const canGoUp = useRef(true);
    const canGoDown = useRef(true);


    const expandDown = useCallback(async () => {
        if (updatingDown.current || !originalTranslations) return;
        updatingDown.current = true;

        const start = originalTranslations[originalTranslations.length - 1];


        api.getTextSegment(start.id, { nextMinLength: 50 }).then(([response, _]) => {
            if(response.length == 1) {
                canGoDown.current = false;
            }
            dispatch(putTranslations({ translations: response, language: originalLanguageId }))

            if (languageId && originalLanguageId != languageId) {
                api.getTextSegment(start.id, { nextMinLength: 50, toLanguageId: languageId }).then(([transResponse, _]) => {
                    const toInput = response.map(orig => transResponse.find(trans => trans.order == orig.order) ?? orig)
                    dispatch(putTranslations({ translations: toInput, language: languageId }))
                }).catch(() => updatingDown.current = false)
            }
        })



        // api.getTextSegment(start.id,  { nextMinLength: 50 }).then(([response, _]) => {
        //     dispatch(putTranslations({ translations: response, language: languageId }))
        // }).catch(() => updating.current = false)

        // if (original != languageId)
        //     api.getTextSegment(start.id, { nextMinLength: 50 }).then(([response, _]) => {
        //         dispatch(putTranslations({ translations: response, language: original }))
        //     })

    }, [originalTranslations])

    const expandUp = useCallback(async () => {
        if (updatingUp.current || !originalTranslations) return;
        updatingUp.current = true;

        const start = originalTranslations[0];

        if (start.order === 0) {
            updatingUp.current = false
            return;
        }

        // TODO: make file have max order
        // if (start.order) {
        //     updating.current = false
        //     canGoUp.current = false
        //     return;
        // }


        api.getTextSegment(start.id, { prevMinLength: 50 }).then(([response, _]) => {
            if(response.length == 1) {
                canGoUp.current = false;
            }
            dispatch(putTranslations({ translations: response, language: originalLanguageId }))

            if (languageId && (originalLanguageId != languageId)) {
                api.getTextSegment(start.id, { prevMinLength: 50, toLanguageId: languageId }).then(([transResponse, _]) => {
                    const toInput = response.map(orig => transResponse.find(trans => trans.order == orig.order) ?? orig)
                    dispatch(putTranslations({ translations: toInput, language: languageId }))
                }).catch(() => updatingUp.current = false)
            }
        })



        //     api.getTextSegment(start.id, { prevMinLength: 50 }).then(([response, _]) => {
        //         dispatch(putTranslations({ translations: response, language: languageId }))
        //     }).catch(() => updating.current = false)

        //     if (original != languageId)
        //         api.getTextSegment(start.id, { prevMinLength: 50 }).then(([response, _]) => {
        //             dispatch(putTranslations({ translations: response, language: original }))
        //         })
    }, [originalTranslations])


    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (e.target.id == 'upper') {
                    console.log('upper')
                    const toTop = divRef.current.scrollHeight - divRef.current.scrollTop - divRef.current.clientHeight;
                    upper.current = true;
                    scrollToTop.current = toTop;
                    expandUp().catch(() => updatingUp.current = false);
                }

                if (e.target.id == 'lower') {
                    expandDown().catch(() => updatingDown.current = false);
                }
            }
        })
    }, [expandUp, expandDown]);

    useEffect(() => {
        expandDown();
        expandUp();
    }, [])

    // useEffect(() => {
    //     const option = {
    //         root: null,
    //         rootMargin: "20px",
    //         threshold: 0
    //     };

    //     const observer = new IntersectionObserver(handleObserver, option);
    //     if (canGoUp.current)
    //         observer.observe(upperEndRef.current);
    //     if (canGoDown.current)
    //         observer.observe(lowerEndRef.current);

    //     return () => observer.disconnect();
    // }, [handleObserver]);

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
        // if (upper.current || scroll) {
        //     divRef.current.scrollTop = divRef.current.scrollHeight - scrollToTop.current - divRef.current.clientHeight;
        // }

        upper.current = false;
        updatingUp.current = false;
        updatingDown.current = false;
    }, [originalTranslations])

    return <div onScroll={handleScroll} ref={divRef} style={{ width: "100%", bottom: 0, height: "90vh", overflowY: "scroll", whiteSpace: "pre-wrap", position: "relative" }} >
        <div id='upper' ref={upperEndRef}></div>
        {originalTranslations && originalTranslations.length > 1 && originalTranslations.map((value, index) => {
            return <TextPiece scroll={scroll} setScroll={index < originalTranslations.length - 1 ? () => { } : () => {
                setScroll(true);
                

            }} key={value.id.toString()} selectedOrder={order} order={value.order} languageId={languageId} originalLanguageId={originalLanguageId} />;
        })}
        <div id='lower' ref={lowerEndRef}></div>
    </div>
}

export default TextDisplay;