import { api } from "api/Api";
import { GetTranslationDto } from "common/dto/translate-piece.dto";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  putTranslationChanges,
  selectTranslationChanges,
} from "store/translate-piece-reducer";
import { SegmentStatus, segmentStatusToText } from "utils/enums";
import "./SegmentSplit.css";

export function segmentStatusToColor(status: SegmentStatus) {
  switch (status) {
    case SegmentStatus.LOCKED:
      return "coral";

    case SegmentStatus.NEW:
      return "cornflowerblue";

    case SegmentStatus.TRANSLATED:
      return "green";

    default:
      return "";
  }
}

const SegmentSplit: React.FC<{ segment: GetTranslationDto }> = ({
  segment,
}) => {
  const translationChanges = useSelector(selectTranslationChanges);
  const dispatch = useDispatch();

  const translation = useMemo(
    () =>
      segment.id in translationChanges
        ? translationChanges[segment.id].translationText
        : segment.translationText,
    [segment, translationChanges]
  );
  const original = useMemo(
    () =>
      segment.original
        ? segment.original.id in translationChanges
          ? translationChanges[segment.original.id].translationText
          : segment.original.translationText
        : undefined,
    [segment, translationChanges]
  );

  const handleSegmentChange = (value: string) => {
    dispatch(
      putTranslationChanges([
        { id: segment.id, comment: "", translationText: value },
      ])
    );
  };

  const handleOriginalChange = (value: string) => {
    dispatch(
      putTranslationChanges([
        { id: segment.original?.id, comment: "", translationText: value },
      ])
    );
  };

  const handleCommitChange = () => {
    api.postTranslations([translationChanges[segment.id]]).then(() => {
      location.reload();
    });
  };

  const handleSuggestTranslation = () => {
    api
      .postSuggestion(
        segment.id,
        translationChanges[segment.id].translationText
      )
      .then(() => {
        location.reload();
      });
  };

  return (
    <div className="segment-split">
      {segment.original && (
        <div className="segment-split_part">
          <div>Оригинал</div>
          {/* <Link to={`/segments/${segment.original.id}`}>Открыть в контексте</Link> */}
          <textarea
            readOnly
            className={`segment-split_textarea ${
              segment.original.id in translationChanges
                ? "segment-split__uncommited-change"
                : ""
            }`}
            onChange={(e) => handleOriginalChange(e.currentTarget.value)}
            value={original}
          />
        </div>
      )}
      <div className="segment-split_part">
        <div>
          Сегмент
          <span
            style={{
              color: "white",
              backgroundColor: segmentStatusToColor(segment.status),
              borderRadius: "5px",
              padding: "0 3px",
              marginLeft: "5px",
              float: "right",
            }}
          >
            {segmentStatusToText(segment.status)}
          </span>
          {segment.suggestionsIds.length > 0 && <span
            style={{
              color: "white",
              backgroundColor: "orange",
              borderRadius: "5px",
              padding: "0 3px",
              marginLeft: "5px",
              float: "right",
            }}
          >
            {"Предложен перевод"}
          </span>}
        </div>
        <Link to={`/segments/${segment.id}`}>Открыть в контексте</Link>
        <textarea
          className={`segment-split_textarea ${
            segment.id in translationChanges
              ? "segment-split__uncommited-change"
              : ""
          }`}
          onChange={(e) => handleSegmentChange(e.currentTarget.value)}
          value={translation}
        />
        <button
          onClick={() => handleCommitChange()}
          disabled={!(segment.id in translationChanges)}
        >
          Сохранить перевод
        </button>
        <button
          onClick={() => handleSuggestTranslation()}
          disabled={!(segment.id in translationChanges)}
          style={{ marginLeft: "5px" }}
        >
          Предложить перевод
        </button>
      </div>
    </div>
  );
};

export default SegmentSplit;
