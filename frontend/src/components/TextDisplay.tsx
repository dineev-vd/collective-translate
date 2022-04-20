import { api } from "api/Api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { putTextPieces, selectTextPieces } from "store/textPieceReducer";
import { putTranslatePieces, selectTranslatePieces } from "store/translatePieceReducer";
import TextPiece from "./TextPiece";
import TranslatePiece from "./TranslatePiece";

const TextDisplay: React.FC = () => {
    const { pieceId } = useParams();
    const translatePieces = useSelector(selectTranslatePieces);
    const textPieces = useSelector(selectTextPieces);
    const [text, setText] = useState<JSX.Element[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!translatePieces[pieceId])
            return;

        const { textPieceId } = translatePieces[pieceId];

        // Check if our `TextPiece` is already loaded.
        // If not - fetch it.
        if (!(textPieceId in textPieces)) {
            api.getTextPiece(textPieceId).then(([response, _]) => {
                dispatch(putTextPieces([response]));
            })

            return;
        }

        const textPiece = textPieces[translatePieces[pieceId].textPieceId]
        const missingTranslatePieces = textPiece.translatePiecesIds.filter(translatePieceId => !(translatePieceId in translatePieces))

        if(missingTranslatePieces.length > 0) {
            api.getTranslatePieces(missingTranslatePieces).then(([response, _]) => {
                dispatch(putTranslatePieces(response))
            })

            return;
        }


        const regexp = /(?<!\\)(\{[^\{\}]+\})(?<!\\\})/;
        let curText: string = textPiece.text;
        const splitted = curText.split(regexp);

        let start = 0;
        const jsxArray = splitted.map((value, index) => {
            let out: JSX.Element;
            if (index % 2 === 0) {
                out = <TextPiece key={index} value={value} start={start} />;
            } else {
                const jsonObj = JSON.parse(value);
                const curTranslatePiece = translatePieces[jsonObj.id];
                out = curTranslatePiece && <TranslatePiece key={index} id={jsonObj.id} before={curTranslatePiece.before} after={curTranslatePiece.after} />;
            }

            start += value.length;
            return out;
        })

        setText(jsxArray);
    }, [pieceId, translatePieces, textPieces]);

    return <div style={{ width: "100%", bottom: 0, height: "100vh", overflow: "scroll", whiteSpace: "pre-wrap" }} >
        {text}
    </div>
}

export default TextDisplay;