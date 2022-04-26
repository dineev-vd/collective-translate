import { api } from 'api/Api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css'

const CreateProject: React.FC = () => {
    const [projectName, setProjectName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const navigate = useNavigate();

    function handleSubmit() {
        api.postProject({ name: projectName, description: description }).then(([response, _]) => {
            navigate(response.id);
        })
    }

    return <form onSubmit={handleSubmit}>
        <div className='create-project-wrapper'>
            <input onChange={e => setProjectName(e.currentTarget.value)} value={projectName} placeholder="Название"></input>
            <textarea onChange={e => setDescription(e.currentTarget.value)} value={description} placeholder="Описание"></textarea>
            <button>Создать</button>
        </div>
    </form>
}

export default CreateProject;