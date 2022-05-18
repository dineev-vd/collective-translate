import { api } from "api/Api";
import { GetSuggestionDto } from "common/dto/suggestion.dto";

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
      <div>{suggestion.suggestion}</div>
      <button onClick={() => handleApprove()}>Одобрить</button>
      <button onClick={() => handleDeny()}>Отклонить</button>
    </div>
  );
};

export default Suggestion;
