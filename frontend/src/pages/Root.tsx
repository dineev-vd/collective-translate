import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
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


const Root = () => {
    const dispatch = useDispatch();
    const [ready, setReady] = useState(false);
    const shuoldLogin = useSelector(selectShouldLogin);
    
    useEffect(() => {
        api.setDispatch(dispatch);
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
                    {shuoldLogin ?
                        <Routes>
                            <Route path='*' element={<Navigate to={'/login'} />} />
                            <Route path='/login' element={<Login />} />
                        </Routes>
                        :
                        <Routes>
                            <Route path='profile' element={<Outlet />} >
                                <Route path=':profileId' element={<ProfilePage />} />
                            </Route>
                            <Route path='search' element={<SearchResults />} />
                            <Route path='project/:projectId/*' element={<ProjectPage />} />
                            <Route path='*' element={<Navigate to={'/'} />} />
                            <Route index element={<LandingPage />} />
                        </Routes>}
                </div>
                :
                <></>
            }
        </>

    )
}

export default Root