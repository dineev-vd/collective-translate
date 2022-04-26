import { api } from "api/Api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FilePeek: React.FC = () => {
    const [peekText, setPeektext] = useState<string>("")
    const { fileId } = useParams();


    useEffect(() => {
        api.getFilePeek(Number(fileId)).then(([response, _]) => {
            setPeektext(response.text)
        })
    }, [fileId])

    return <>
        <textarea readOnly value={peekText}></textarea>
        <button onClick={() => api.splitFile(Number(fileId)).then()}>Обработать</button>
    </>
}

export default FilePeek;