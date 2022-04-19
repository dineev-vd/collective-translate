import { api } from "api/Api";
import TextPiece from "components/TextPiece";
import TranslatePiece from "components/TranslatePiece";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const TranslatePiecePage: React.FC<{}> = () => {
    const { projectId, pieceId } = useParams();
    const [translatePiece, setTranslatePiece] = useState<any>();
    const [textPiece, setTextPiece] = useState<any>();
    const [text, setText] = useState<JSX.Element[]>([]);
    const [after, setAfter] = useState<string>();

    useEffect(() => {
        api.getTranslatePiece(pieceId).then(response => {
            setTranslatePiece(response);
        });
    }, [])

    useEffect(() => {
        if (!translatePiece) {
            return;
        }

        api.getTextPiece(projectId, translatePiece.textPiecesIds.map(e => e.sequenceNumber)).then(response => {
            setTextPiece(response);
        })
    }, [translatePiece])

    useEffect(function kekw() {
        if (!textPiece) return;

        const map = new Map();
        textPiece[0].translatePieces.forEach(piece => {
            map[piece['id']] = piece;
        })

        const regexp = /(?<!\\)(\{[^\{\}]+\})(?<!\\\})/;
        let curText: string = textPiece[0].text;
        const splitted = curText.split(regexp);

        let start = 0;
        const jsxArray = splitted.map((value, index) => {
            let out: JSX.Element;
            if (index % 2 === 0) {
                out = <TextPiece value={value} start={start} />;
            } else {
                const jsonObj = JSON.parse(value);
                const translatePiece = map[jsonObj.id];
                out = <TranslatePiece before={translatePiece.before} after={translatePiece.after} />;
            }

            start += value.length;
            return out;
        })

        setText(jsxArray);
    }, [textPiece]);

    const onSubmit = (e) => {
        e.preventDefault();
        api.putTranslatePiece(pieceId, {after: after}).then((e) => {
            window.location.reload();
        });
    }

    return <div style={{ display: "flex", flexDirection: "row", flex: "1 1 auto" }}>
        <div style={{ width: "100%" }}>
            {translatePiece && <>
                <h3>Перевод до:</h3>
                <input disabled value={translatePiece.before} />

                <h3>Перевод после:</h3>
                <form onSubmit={onSubmit}>
                    <input defaultValue={translatePiece.after} onChange={e => setAfter(e.target.value)} />
                </form>
            </>}
        </div>

        <div style={{ width: "100%" }} >
            {text}
        </div>
    </div>
}

export default TranslatePiecePage;