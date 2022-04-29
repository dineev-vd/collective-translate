import { GetActionDto, PostActionDto } from "@common/dto/action.dto";
import { GetTranslateLanguage } from "@common/dto/language.dto";
import { api } from "api/Api";
import TextDisplay from "components/TextDisplay";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { appendTranslations, putTranslationChanges, putTranslations, selectTranslationChanges, selectTranslations } from "store/translate-piece-reducer";
import "./TranslatePiecePage.css";


const TranslationPage: React.FC<{}> = () => {
    const params = useParams<string>();
    const segmentId = params.segmentId;
    const [languageId, setLanguageId] = useState<string>();
    const [languages, setLanguages] = useState<GetTranslateLanguage[]>([]);
    const original = useMemo(() => languages.find(l => l.original), [languages]);

    // store
    const dispatch = useDispatch();

    const selectedTranslations = useSelector(selectTranslations);
    const translations = useMemo(() => selectedTranslations[languageId], [languageId, selectedTranslations]);
    const originalTranslations = useMemo(() => selectedTranslations[original?.id], [selectedTranslations, original]);



    const translationChanges = useSelector(selectTranslationChanges);

    const [actions, setActions] = useState<GetActionDto[]>([]);
    const [order, setOrder] = useState<number>();
    //const languageId = Number(params.languageId);
    const segment = useMemo(() => {
        if (languageId == original?.id)
            return undefined;

        return translations && translations[order - translations[0]?.order]
    }, [translations, order, original, languageId])
    const originalSegment = useMemo(() => originalTranslations && originalTranslations[order - originalTranslations[0]?.order], [originalTranslations, translations, order])

    useEffect(() => {
        if (!segmentId)
            return;

        api.getLanguagesBySegment(segmentId).then(([languages, _]) => {
            setLanguages(languages);
            api.getLanguageBySegment(segmentId).then(([langResponse, _]) => {
                setLanguageId(langResponse.id.toString());
                api.getTextSegment(+segmentId).then(([[response], _]) => {
                    dispatch(putTranslations({ language: langResponse.id, translations: [response] }))
                    setOrder(response.order);
                })
            })
        })

    }, [segmentId])

    useEffect(() => {
        if (originalSegment || !original || !segmentId)
            return;

        api.getTextSegment(+segmentId, { toLanguageId: original.id }).then(([response, _]) => {
            dispatch(putTranslations({ language: original.id, translations: response }))
        })

    }, [originalSegment, original, segmentId])

    const handleSubmit = (e) => {
        e.preventDefault();
        const textChange = translationChanges[originalSegment.id];
        const translationChange = translationChanges[segment.id];

        let arr: PostActionDto[] = [];
        if (textChange) {
            arr.push({ change: textChange.translationText, textSegmentId: originalSegment.id, comment: '' })
        }

        if (translationChange) {
            arr.push({ change: translationChange.translationText, textSegmentId: segment.id, comment: '' })
        }

        api.postActions(arr).then(() => {
            window.location.reload();
        })
    }

    



    return <div style={{ display: "flex", flexDirection: "row", flex: "1 1 auto" }}>
        <div style={{ width: "100%" }}>
            <form onSubmit={(e) => handleSubmit(e)}>
                {originalSegment && (<div>
                    <h3>Перевод до:</h3>
                    <textarea onChange={e => dispatch(putTranslationChanges([{ id: originalSegment.id, translation: { translationText: e.target.value, comment: "" } }]))}
                        value={originalSegment.id in translationChanges ? translationChanges[originalSegment.id].translationText : originalSegment.translationText} />
                </div>)}

                {segment && (<div>
                    <h3>Перевод после:</h3>
                    <textarea onChange={e => dispatch(putTranslationChanges([{ id: segment.id, translation: { translationText: e.target.value, comment: "" } }]))}
                        value={segment.id in translationChanges ? translationChanges[segment.id].translationText : segment.translationText} />
                    <button type="submit">Отправить измеения</button>
                </div>)}
            </form>
            {/* {actions && (
                <>
                    <h3>История изменений: </h3>
                    {actions.map(edit =>
                        <div>
                            <h5>Автор:</h5>
                            <Link to={`/profile/${edit.author.id}`}> {edit.author.name} </Link>
                            <h5>Изменение:</h5>
                            {edit.change}
                            <h5>Заметка:</h5>
                            {edit.comment}
                        </div>
                    )}
                </>
            )} */}
        </div>
        {originalSegment && <TextDisplay originalLanguageId={original.id.toString()} order={order} languageId={languageId} />}
    </div>

}

export default TranslationPage;