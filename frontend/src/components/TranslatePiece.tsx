import { useState } from "react";

const TranslatePiece: React.FC<{ before: string, after: string }> = ({ before, after }) => {
    const [state, changeState] = useState<boolean>(false);

    return <span style={{ backgroundColor: state ? "lightblue" : "lightcoral", opacity: state && !(after.length > 0) ? 0.5 : 1}} onClick={() => changeState(state => !state)}>{state ? (after.length > 0 ? after : "Пока не переведено") : before}</span>
}

export default TranslatePiece;