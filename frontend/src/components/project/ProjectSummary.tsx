import { ChangeEvent, useState } from "react";
import { GetProjectDto, ChangeProjectDto } from "common/dto/project.dto";
import { useEffect } from "react";
import { api } from "api/Api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "store/userReducer";

const ProjectSummary: React.FC<{}> = () => {
  const { projectId } = useParams();
  const [summaryResponse, setSummaryResponse] = useState<GetProjectDto>();
  const [change, setChange] = useState<ChangeProjectDto>();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    api.getProjectById(projectId).then(([response, _]) => {
      setSummaryResponse(response);
      setChange({ name: response.name, description: response.description });
    });
  }, [projectId]);

  const handleChange = () => {
    api.updateProject(projectId, change).then(() => {
      location.reload();
    });
  };

  return (
    <>
      {summaryResponse && (
        <div>
          {summaryResponse &&
            (summaryResponse.editorsId.includes(user.id.toString()) ||
            summaryResponse.ownerId == user.id.toString()) && (
              <button onClick={() => setShowEdit((prev) => !prev)}>
                {!showEdit ? "Изменить" : "Отмена"}
              </button>
            )}

          {showEdit && (
            <>
              <br></br>
              <button onClick={() => handleChange()}>
                Закончить изменения
              </button>
            </>
          )}
          {showEdit ? (
            <>
              <br></br>
              Название проекта
              <br></br>
              <input
                onChange={(e) =>
                  setChange((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
                value={change.name}
              />
            </>
          ) : (
            <h1>{summaryResponse.name}</h1>
          )}
          {showEdit ? (
            <>
              <br></br>
              Описание проекта
              <br></br>
              <textarea
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                value={change.description}
              />
            </>
          ) : (
            <h4>{summaryResponse.description}</h4>
          )}
          <div>Всего сегментов: {summaryResponse.all}</div>
          <div>Переведено: {summaryResponse.translated}</div>
        </div>
      )}
    </>
  );
};

export default ProjectSummary;
