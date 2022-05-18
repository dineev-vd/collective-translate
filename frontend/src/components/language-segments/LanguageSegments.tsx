import { GetTranslationDto } from "common/dto/translate-piece.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SegmentSplit from "./SegmentSplit";
import "./LanguageSegments.css";
import { GetActionDto } from "common/dto/action.dto";
import { GetSuggestionDto } from "common/dto/suggestion.dto";
import Suggestion from "./Suggestion";
import Pager from "components/ui-components/Pager";
import TextDisplay from "components/text/TextDisplay";
import { SegmentStatus, segmentStatusToText } from "utils/enums";

const LanguageSegments: React.FC = () => {
  const { languageId } = useParams();
  const [segments, setSegments] = useState<GetTranslationDto[]>([]);
  const [actions, setActions] = useState<GetActionDto[]>();
  const [selectedId, setSelectedId] = useState<string>();
  const [suggestions, setSuggestions] = useState<GetSuggestionDto[]>();
  const [page, setPage] = useState<number>(1);
  const [maxPages, setMaxPages] = useState<number>();

  const [statusFilter, setStatusFilter] = useState<SegmentStatus>(null);
  const [hasSuggestionsFilter, setHasSuggestions] = useState<boolean>(null);

  useEffect(() => {
    api
      .getTranslationsByLanguage(languageId, {
        shouldTranslate: true,
        withOriginal: true,
        page: page,
        status: statusFilter,
        hasSuggestions: hasSuggestionsFilter
      })
      .then(
        ([
          {
            data,
            meta: { totalReacords },
          },
          _,
        ]) => {
          setSegments(data);
          setMaxPages(Math.ceil(totalReacords / 10));
        }
      );
  }, [languageId, page, statusFilter, hasSuggestionsFilter]);

  useEffect(() => {
    api.getActions(+selectedId).then(([response, _]) => {
      setActions(response);
    });
  }, [selectedId]);

  useEffect(() => {
    api.getSuggestions(selectedId).then(([response, _]) => {
      setSuggestions(response);
    });
  }, [selectedId]);

  return (
    <div className="language-segments">
      <div className="language-segments_left">
        <Pager page={page} setPage={setPage} maxPages={maxPages} />
        <select value={statusFilter === null ? -1 : statusFilter} onChange={e => setStatusFilter(e.currentTarget.value == '-1' ? null : e.currentTarget.value as SegmentStatus)}>
          <option value={-1}>Все</option>
          {Object.values(SegmentStatus).map(value => (
            <option>{value}</option>
          ))}
        </select>
        <select
          value={hasSuggestionsFilter === null ? -1 : +hasSuggestionsFilter}
          onChange={e => setHasSuggestions(e.currentTarget.value === '-1' ? null : !!+e.currentTarget.value)}
        >
          <option value={-1}>Все</option>
          <option value={1}>Только с предложенным переводом</option>
          <option value={0}>Без предложенного переводом</option>
        </select>
        <div className="language-segments_left">
          {segments.map((segment) => (
            <div
              onClick={() => setSelectedId(segment.id)}
              className={`language-segments_wrapper ${
                segment.id == selectedId ? "language-segments__selected" : ""
              }`}
            >
              <SegmentSplit segment={segment} />
            </div>
          ))}
        </div>
      </div>
      <div className="language-segments_right">
        <TextDisplay segmentId={selectedId} />
        {actions ? (
          <>
            <h3>История изменений: </h3>
            {actions.map((edit) => (
              <div key={edit.id}>
                {edit.author && (
                  <div>
                    <h5>Автор:</h5>
                    <Link to={`/profile/${edit.author.id}`}>
                      {" "}
                      {edit.author.name}{" "}
                    </Link>
                  </div>
                )}
                <h5>Изменение:</h5>
                {edit.change}
                {edit.comment && (
                  <div>
                    <h5>Заметка:</h5>
                    {edit.comment}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <h3>Выберите сегмент для просмотра истории</h3>
        )}
        {suggestions && suggestions.map((s) => <Suggestion suggestion={s} />)}
      </div>
    </div>
  );
};

export default LanguageSegments;
