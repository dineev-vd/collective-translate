import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Header from 'components/Header';
import ProjectPage from './ProjectPage';
import "./Root.css";
import SearchResults from './SearchResults';
import LandingPage from './LangingPage';
import { useDispatch, useSelector } from 'react-redux';
import { api } from 'api/Api';
import { selectShouldLogin, setUser } from 'store/userReducer';
import ProfilePage from './ProfilePage';
import Login from 'components/Login';
import TextSegments from 'components/LanguageTranslations';
import TranslationPage from './TranslatePiecePage';
import CreateProject from 'components/CreateProject';
import { auth } from 'api/Auth';


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
                            <Route path='profile' element={<Outlet />} >
                                <Route path=':profileId' element={<ProfilePage />} />
                            </Route>
                            <Route path='translate/:segmentId' element={<TranslationPage />} />
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