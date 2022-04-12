import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import ProjectPage from './ProjectPage';
import "./Root.css";
import SearchResults from './SearchResults';
import LandingPage from './LangingPage';


const Root = () => {
    return (
        <div className="root">
            <Header />
            <Routes>
                <Route path='/search' element={<SearchResults />} />
                <Route path='/project/:id*' element={<ProjectPage/>} />
                <Route path='/' element={<LandingPage/>}/>
            </Routes>
        </div>
    )
}

export default Root