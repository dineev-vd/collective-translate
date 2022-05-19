import { api } from "api/Api";
import { GetSuggestionDto } from "common/dto/suggestion.dto";
import { Link } from "react-router-dom";

const Suggestion: React.FC<{ suggestion: GetSuggestionDto }> = ({
  suggestion,
}) => {
  const handleApprove = () => {
    api.approveSuggestion(suggestion.id).then(() => {
      location.reload();
    });
  };

  const handleDeny = () => {
    api.denySuggestion(suggestion.id).then(() => {
      location.reload();
    });
  };

  return (
    <div>
      <div style={{marginTop: "10px"}}><b>Предложение:</b></div>
      <div style={{margin: "10px 0", border: "1px solid gray", borderRadius: "10px", padding: "10px"}}>{suggestion.suggestion}</div>
      <div style={{marginBottom: "10px"}}>
        Автор:{" "}
        <span>
          <Link to={`/profile/${suggestion.author.id}`}>
            {suggestion.author.name}
          </Link>
        </span>
      </div>
      <button style={{marginRight: "5px"}} onClick={() => handleApprove()}>Одобрить</button>
      <button onClick={() => handleDeny()}>Отклонить</button>
    </div>
  );
};

export default Suggestion;
