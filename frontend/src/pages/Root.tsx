import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Header from 'components/ui-components/Header';
import ProjectPage from './ProjectPage';
import "./Root.css";
import SearchResults from './SearchResults';
import LandingPage from './LangingPage';
import { useDispatch, useSelector } from 'react-redux';
import { api } from 'api/Api';
import { selectShouldLogin, setUser } from 'store/userReducer';
import ProfilePage from './ProfilePage';
import Login from 'components/ui-components/Login';
import TextSegments from 'components/language/LanguageTranslations';
import TranslationPage from './TranslatePiecePage';
import CreateProject from 'components/project/CreateProject';
import { auth } from 'api/Auth';
import LanguageSegments from 'components/language-segments/LanguageSegments';
import LanguageSegmentsPage from './LanguageSegmentsPage';


const Root = () => {
    const dispatch = useDispatch();
    const [ready, setReady] = useState(false);
    const shuoldLogin = useSelector(selectShouldLogin);
    const navigate = useNavigate();

    useEffect(() => {
        api.setDispatch(dispatch, () => navigate('/login'));

        if (!auth.getAccessToken()) {
            setReady(true);
            return;
        }

        api.getProfile().then(([user, _]) => {
            dispatch(setUser(user))
        }).finally(() => {
            setReady(true);
        });
    }, [])

    return (
        <>
            {ready ?
                <div className="root">
                    <Header />
                    <div className='content-wrapper'>

                        <Routes>
                            <Route path='profile/:profileId/*' element={<ProfilePage />} />
                            <Route path='segments/:segmentId' element={<TranslationPage />} />
                            <Route path='languages/:languageId' element={<LanguageSegmentsPage />} />
                            <Route path='search' element={<SearchResults />} />
                            <Route path='project/create' element={<CreateProject />} />
                            <Route path='project/:projectId/*' element={<ProjectPage />} />
                            <Route path='/login' element={<Login />} />

                            <Route path='*' element={<div>404</div>} />
                            <Route index element={<LandingPage />} />
                        </Routes>
                    </div>
                </div>
                :
                <></>
            }
        </>

    )
}

export default Root