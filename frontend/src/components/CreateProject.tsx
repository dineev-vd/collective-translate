import { api } from 'api/Api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css'

enum Language {
    RUSSIAN = 'Русский',
    ENGLISH = 'Английский',
    GERMAN = 'Немецкий'
  }
  

const CreateProject: React.FC = () => {
    const [projectName, setProjectName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [language, setLanguage] = useState<Language>(Language.RUSSIAN);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        console.log(language)
        api.postProject({ name: projectName, description: description, language: language }).then(([response, _]) => {
            navigate(`/project/${response.id}`);
        })
    }

    return <form onSubmit={handleSubmit}>
        <div className='create-project-wrapper'>
            <input onChange={e => setProjectName(e.currentTarget.value)} value={projectName} placeholder="Название"></input>
            <textarea onChange={e => setDescription(e.currentTarget.value)} value={description} placeholder="Описание"></textarea>
            <select value={language} onChange={(e) => setLanguage(e.currentTarget.value as Language)}>
                {Object.values(Language).map(l => (
                    <option value={l}>{l}</option>
                ))}
            </select>
            <button>Создать</button>
        </div>
    </form>
}

export default CreateProject;