import "./Header.css"
import { } from "@blueprintjs/core"
import React, { FormEvent } from "react"
import { useState } from "react"
import { Link, useMatch, useNavigate } from "react-router-dom"
import { api } from "api/Api"
import { useSelector } from "react-redux"
import { selectUser } from "store/userReducer"
import TopMenuProfile from "./TopMenuProfile"

const Header: React.FC = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const navigate = useNavigate();
    const curUser = useSelector(selectUser);
    const match = useMatch("/");
    const [showTopMenu, setShowTopMenu] = useState(false);

    function handleChange(event) {
        setSearchValue(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        navigate(`/search?query=${searchValue}`);
    }

    return (
        <header className="header">
            <Link to={'/'}>Главная</Link>
            <div className="header_input_wrapper">
                {!match && <form onSubmit={handleSubmit}>
                    <input placeholder="Поиск..." className="header_input" onChange={handleChange} value={searchValue}></input>
                </form >}
            </div>
            {curUser ?
                <>
                    <div className="header_profile" onClick={() => setShowTopMenu(prev => !prev)}>
                        <div className="header_profile_name">
                            {curUser.name}
                        </div>
                        <div className="header_avatar">
                        </div>
                    </div>
                    <TopMenuProfile show={showTopMenu} />
                </>
                :
                <Link to={'/login'}>Вход</Link>
            }
        </header>
    )
}


export default Header;