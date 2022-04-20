import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { changeTranslatePiece } from "store/translatePieceReducer";

const TranslatePiece: React.FC<{ id: string, before: string, after: string }> = ({ id, before, after }) => {
    const [state, changeState] = useState<boolean>(false);
    const { id: idParams } = useParams();
    const spanRef = useRef<HTMLSpanElement>();
    const dispatch = useDispatch();
    const prevUpdateInside = useRef<boolean>(false);

    function update() {
        console.log(spanRef.current.innerText);

        if (state) {
            dispatch(changeTranslatePiece({ id: id, after: spanRef.current.innerHTML }))
        } else {
            dispatch(changeTranslatePiece({ id: id, before: spanRef.current.innerHTML }))
        }

        prevUpdateInside.current = true;
    }

    useEffect(() => {
        if (prevUpdateInside.current) {
            prevUpdateInside.current = false;
            return;
        }

        spanRef.current.innerText = state ? (after.length > 0 ? after : "Пока не переведено") : before;
    }, [before, after])

    return <span
        key={id}
        contentEditable="true"
        suppressContentEditableWarning={true}
        onInput={_ => update()}
        ref={spanRef}
        style={{
            backgroundColor: state ? "lightblue" : (idParams == id ? "lightgreen" : "lightcoral"),
            opacity: state && !(after.length > 0) ? 0.5 : 1,
            outline: 0,
            whiteSpace: "pre-wrap"
        }}></span>
}

export default TranslatePiece;