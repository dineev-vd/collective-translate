import { GetTextPieceDto } from "@common/dto/text-piece.dto";
import { api } from "api/Api";
import TextDisplay from "components/TextDisplay";
import TextPiece from "components/TextPiece";
import TranslatePiece from "components/TranslatePiece";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { putTextPieces, selectTextPieces } from "store/textPieceReducer";
import { changeTranslatePiece, putTranslatePieces, selectTranslatePieces } from "store/translatePieceReducer";

const TranslatePiecePage: React.FC<{}> = () => {
    const { pieceId } = useParams<string>();
    const dispatch = useDispatch();
    const translatePieces = useSelector(selectTranslatePieces);
    const textPieces = useSelector(selectTextPieces);


    useEffect(() => {
        // Check if our `TranslatePiece` is already loaded.
        // If not - fetch it.
        if (!(pieceId in translatePieces)) {
            api.getTranslatePiece(pieceId).then(([response, _]) => {
                dispatch(putTranslatePieces([response]))
            });

            return;
        }

    }, [pieceId, translatePieces])

    // const onSubmit = (e) => {
    //     e.preventDefault();
    //     api.putTranslatePiece(pieceId, { after: after }).then((e) => {
    //         window.location.reload();
    //     });
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        api.putTranslatePiece(pieceId, { after: translatePieces[pieceId].after, before: translatePieces[pieceId].before }).then(([response, { ok }]) => {
            if (ok) {
                dispatch(putTranslatePieces([response]))
            }
        })
    }

    return <div style={{ display: "flex", flexDirection: "row", flex: "1 1 auto" }}>
        <div style={{ width: "100%" }}>
            {translatePieces[pieceId] && <>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <h3>Перевод до:</h3>
                    <textarea onChange={e => dispatch(changeTranslatePiece({ id: pieceId, before: e.target.value }))} value={translatePieces[pieceId].before} />

                    <h3>Перевод после:</h3>
                    <textarea onChange={e => dispatch(changeTranslatePiece({ id: pieceId, after: e.target.value }))} value={translatePieces[pieceId].after} />
                    <button type="submit">Отправить измеения</button>
                </form>
                {translatePieces[pieceId].history && (
                    <>
                        <h3>История изменений: </h3>
                        {translatePieces[pieceId].history.map(edit =>
                            <div>
                                <h5>Автор:</h5>
                                {edit.author.name}
                                <h5>Изменение:</h5>
                                {edit.change}
                            </div>
                        )}
                    </>
                )}
            </>}
        </div>

        <TextDisplay />
    </div>
}

export default TranslatePiecePage;