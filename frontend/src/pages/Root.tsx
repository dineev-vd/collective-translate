import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import ProjectPage from './ProjectPage';
import "./Root.css";
import SearchResults from './SearchResults';
import LandingPage from './LangingPage';
import { useDispatch } from 'react-redux';
import { api } from 'api/Api';
import { setUser } from 'store/userReducer';


const Root = () => {
    const dispatch = useDispatch();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        api.getProfile().then(([user, _]) => {
            dispatch(setUser(user))
        }).finally(() => {
            setReady(true);
        });
    }, [])

    return (
        <>
            {
                ready ?
                    <div className="root">
                        < Header />
                        <Routes>
                            <Route path='/search' element={<SearchResults />} />
                            <Route path='project/:projectId/*' element={<ProjectPage />} />
                            <Route path='/' element={<LandingPage />} />
                        </Routes>
                    </div > : <></>}
        </>

    )
}

export default Root