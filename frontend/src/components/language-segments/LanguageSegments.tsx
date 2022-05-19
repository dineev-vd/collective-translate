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
import {GetProjectDto} from 'common/dto/project.dto'

const LanguageSegments: React.FC<{project: GetProjectDto}> = ({project}) => {
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
        hasSuggestions: hasSuggestionsFilter,
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
      <div
        className={`language-segments_left ${
          !(
            selectedId &&
            ((actions && actions.length > 0) ||
              (suggestions && suggestions.length > 0))
          )
            ? "hidden"
            : ""
        }`}
      >
        {suggestions && suggestions.length > 0 && (
          <div>
            <h3>Предложенные переводы</h3>
            {suggestions.map((s) => (
              <Suggestion suggestion={s} />
            ))}
          </div>
        )}
        {actions && actions.length > 0 ? (
          <>
            <h3 style={{marginTop: suggestions && suggestions.length > 0 ? "50px" : "inherit"}}>История изменений</h3>
            {actions.map((edit) => (
              <div key={edit.id}>
                {edit.author && (
                  <div>
                    <h5>Автор: <Link to={`/profile/${edit.author.id}`}>
                      {edit.author.name}
                    </Link></h5>
                    
                  </div>
                )}
                <h5>Изменение:</h5>
                {`"${edit.change}"`}
                {edit.comment && (
                  <div>
                    <h5>Заметка:</h5>
                    {`"${edit.comment}"`}
                  </div>
                )}
                {edit.timestamp && (<div>
                  <h5>{'Время изменения: '}</h5>
                  {`${new Date(edit.timestamp).toLocaleString()}`} 
                </div>)}
              </div>
            ))}
          </>
        ) : null}
      </div>
      <div className={`language-segments_main`}>
        <h3>Сегменты</h3>
        <Pager page={page} setPage={setPage} maxPages={maxPages} />
        <span style={{marginRight: "5px"}}>Фильтр по статусу сегмента:</span>
        <select
          value={statusFilter === null ? -1 : statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.currentTarget.value == "-1"
                ? null
                : (e.currentTarget.value as SegmentStatus)
            )
          }
        >
          <option value={-1}>Все</option>
          {Object.values(SegmentStatus).map((value) => (
            <option value={value}>{segmentStatusToText(value)}</option>
          ))}
        </select>
        <br></br>
        <span style={{marginRight: "5px"}}>Фильтр по предложенным переводам:</span>

        <select
          value={hasSuggestionsFilter === null ? -1 : +hasSuggestionsFilter}
          onChange={(e) =>
            setHasSuggestions(
              e.currentTarget.value === "-1" ? null : !!+e.currentTarget.value
            )
          }
        >
          <option value={-1}>Все</option>
          <option value={1}>Только с предложенным переводом</option>
          <option value={0}>Без предложенного переводом</option>
        </select>
        <div>
          {segments.map((segment) => (
            <div
              onClick={() => setSelectedId(segment.id)}
              className={`language-segments_wrapper ${
                segment.id == selectedId ? "language-segments__selected" : ""
              }`}
            >
              <SegmentSplit segment={segment} project={project}/>
            </div>
          ))}
        </div>
      </div>

      <div className={`language-segments_right ${!selectedId ? "hidden" : ""}`}>
        <h3>Контекст</h3>
        <TextDisplay segmentId={selectedId} />
      </div>
    </div>
  );
};

export default LanguageSegments;
