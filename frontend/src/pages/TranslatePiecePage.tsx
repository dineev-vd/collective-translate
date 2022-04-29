import { GetActionDto, PostActionDto } from "@common/dto/action.dto";
import { GetTranslateLanguage } from "@common/dto/language.dto";
import { GetTranslationDto } from "@common/dto/translate-piece.dto";
import { api } from "api/Api";
import TextDisplay from "components/TextDisplay";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { putTranslationChanges, putTranslations, selectTranslationChanges, selectTranslations } from "store/translate-piece-reducer";
import { getEffectiveConstraintOfTypeParameter } from "typescript";
import "./TranslatePiecePage.css";


const TranslationPage: React.FC<{}> = () => {
    const { segmentId } = useParams<string>();
    const dispatch = useDispatch();
    const [origSegmentId, setOrigSegmentId] = useState<string>();

    const translations = useSelector(selectTranslations);

    const segment = useMemo(() => translations[segmentId], [segmentId, translations]);
    const originalSegment = useMemo(() => translations[origSegmentId], [origSegmentId, translations]);

    useEffect(() => {
        // check if segmentId in store
        if (segmentId in translations) {
            return;
        }

        // if its not - fetch
        api.getTextSegment(+segmentId, { withOriginal: true }).then(([response, _]) => {
            dispatch(putTranslations(response));
        })
    }, [segmentId])

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
                    <h3>Оригинал:</h3>
                    <textarea onChange={e => dispatch(putTranslationChanges([{ id: +originalSegment.id, translation: { translationText: e.target.value, comment: "" } }]))}
                        value={originalSegment.id in translationChanges ? translationChanges[originalSegment.id].translationText : originalSegment.translationText} />
                </div>)}

                {segment && (<div>
                    <h3>Перевод:</h3>
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