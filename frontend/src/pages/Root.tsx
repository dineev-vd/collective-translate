import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import ProjectPage from './ProjectPage';
import "./Root.css";
import SearchResults from './SearchResults';
import LandingPage from './LangingPage';
import TranslatePiecePage from './TranslatePiecePage';
import { Provider } from 'react-redux';
import { store } from 'store/store';


const Root = () => {
    return (
        <Provider store={store} >
            <div className="root">
                <Header />
                <Routes>
                    <Route path='/search' element={<SearchResults />} />
                    <Route path='project/:projectId/*' element={<ProjectPage />} />
                    <Route path='/' element={<LandingPage />} />
                </Routes>
            </div>
        </Provider>
    )
}

export default Root