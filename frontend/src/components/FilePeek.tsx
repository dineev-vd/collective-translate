import { api } from "api/Api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { JsxElement } from "typescript";
import "./FilePeek.css"

const FilePeek: React.FC = () => {
    const [peekText, setPeektext] = useState<string>("");
    const [markedText, setMarkedText] = useState<{ marked: Boolean, text: string }[]>([]);
    const { fileId } = useParams();
    const [regexpString, setReString] = useState<string>("");

    useEffect(() => {
        try {
            // const re = new RegExp(`(${regexpString})`, 'g');
            const re = /(p{Lu})/g;
            console.log(re);
            const splitted = peekText.split(re);
            const splitArray = splitted.map((split, index) => (
                { marked: index % 2 !== 0, text: split }
            ))

            setMarkedText(splitArray);
        } catch {

        }
    }, [regexpString, peekText])

    function handleChange(e) {
        setReString(e.currentTarget.value);
    }

    useEffect(() => {
        api.getFilePeek(Number(fileId)).then(([response, _]) => {
            setPeektext(response.text)
        })
    }, [fileId])

    return <div className="file-peek">
        <div className="file-peek_process">
            <button onClick={() => api.splitFile(Number(fileId)).then()}>Обработать</button>
            <input onChange={handleChange} value={regexpString}></input>
        </div>
        <div className="file-peek_text">{markedText.map(e =>
            <span className={`file-peek_text-segment ${e.marked ? 'file-peek_marked' : ''}`}>
                {e.text}
            </span>)}</div>
    </div>
}

export default FilePeek;