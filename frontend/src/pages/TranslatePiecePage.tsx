import { GetActionDto, PostActionDto } from "@common/dto/action.dto";
import { api } from "api/Api";
import TextDisplay from "components/TextDisplay";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { putTextChanges, selectTextChanges, selectTextSegments } from "store/text-segment-reducer";
import { putTranslationChanges, putTranslations, selectTranslationChanges, selectTranslations } from "store/translate-piece-reducer";

const TranslationPage: React.FC<{}> = () => {
    const params = useParams<string>();
    const translationId = Number(params.translationId);
    const dispatch = useDispatch();
    const translations = useSelector(selectTranslations);
    const translationChanges = useSelector(selectTranslationChanges);
    const textChanges = useSelector(selectTextChanges);
    const textSegments = useSelector(selectTextSegments);
    const [actions, setActions] = useState<GetActionDto[]>([]);
    const languageId = Number(params.languageId);


    useEffect(() => {
        // Check if our `TranslatePiece` is already loaded.
        // If not - fetch it.
        if (!(translationId in translations)) {
            api.getTranslation(translationId.toString()).then(([response, _]) => {
                dispatch(putTranslations([{ id: response.id, translation: { id: response.id, translationText: response.translationText, textSegmentId: response.textSegmentId } }]));
                //dispatch(putTextSegments([{...response.textSegment, translationId: response.id}]))
            });

            return;
        }

    }, [translationId, translations])

    useEffect(() => {
        if (!translations[translationId])
            return

        api.getActions(translations[translationId].textSegmentId).then(([response, _]) => {
            setActions(response);
        })
    }, [translationId, textSegments, translations])

    const handleSubmit = (e) => {
        e.preventDefault();
        const textChange = textChanges[translations[translationId].textSegmentId];
        const translationChange = translationChanges[translationId];

        let arr: PostActionDto[] = [];
        if (textChange) {
            arr.push({ change: textChange.text, textSegmentId: translations[translationId].textSegmentId, comment: '' })
        }

        if (translationChange) {
            arr.push({ languageId: languageId, textSegmentId: translations[translationId].textSegmentId, change: translationChange.translationText, comment: '' })
        }

        api.postActions(arr).then(() => {
            window.location.reload();
        })
    }

    return <div style={{ display: "flex", flexDirection: "row", flex: "1 1 auto" }}>
        <div style={{ width: "100%" }}>
            {translations[translationId] && textSegments[translations[translationId].textSegmentId] && <>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <h3>Перевод до:</h3>
                    <textarea onChange={e => dispatch(putTextChanges([{ id: translations[translationId].textSegmentId, textSegment: { comment: "", text: e.target.value } }]))}
                        value={translations[translationId].textSegmentId in textChanges ? textChanges[translations[translationId].textSegmentId].text : textSegments[translations[translationId].textSegmentId].text} />

                    <h3>Перевод после:</h3>
                    <textarea onChange={e => dispatch(putTranslationChanges([{ id: translationId, translation: { translationText: e.target.value, comment: "" } }]))}
                        value={translationId in translationChanges ? translationChanges[translationId].translationText : translations[translationId].translationText} />
                    <button type="submit">Отправить измеения</button>
                </form>
                {actions && (
                    <>
                        <h3>История изменений: </h3>
                        {actions.map(edit =>
                            <div>
                                {/* <h5>Автор:</h5>
                                <Link to={`/profile/${edit.author.id}`}> {edit.author.name} </Link> */}
                                <h5>Изменение:</h5>
                                {edit.change}
                                <h5>Заметка:</h5>
                                {edit.comment}
                            </div>
                        )}
                    </>
                )}
            </>}
        </div>

        {translations[translationId] && <TextDisplay />}
    </div>
}

export default TranslationPage;