import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { changeTranslatePiece } from "store/translatePieceReducer";

const TranslatePiece: React.FC<{ id: string, before: string, after: string, scroll: (value: number) => void }> = ({ id, before, after, scroll }) => {
    const [state, changeState] = useState<boolean>(false);
    const { pieceId } = useParams();
    const spanRef = useRef<HTMLDivElement>();
    const dispatch = useDispatch();
    const prevUpdateInside = useRef<boolean>(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        if(pieceId == id) {
            scroll(spanRef.current.offsetTop);
        }
    }, [])

    return <span>
        <button onClick={() => navigate(`../pieces/${id}`)} style={{height: "1rem"}}></button>
        <span
            key={id}
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={_ => update()}
            ref={spanRef}
            style={{
                backgroundColor: state ? "lightblue" : (pieceId == id ? "lightgreen" : "lightcoral"),
                opacity: state && !(after.length > 0) ? 0.5 : 1,
                outline: 0,
                whiteSpace: "pre-wrap"
            }}></span>
    </span>
}

export default TranslatePiece;