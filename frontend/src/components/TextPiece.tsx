const TextPiece: React.FC<{ value: string, start: number }> = ({ value, start }) => {


    return <span>
        {value}
    </span>;
}

export default TextPiece;