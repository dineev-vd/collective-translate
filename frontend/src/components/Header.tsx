import "./Header.css"
import { } from "@blueprintjs/core"
import React, { FormEvent } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "api/Api"
import { useSelector } from "react-redux"
import { selectUser } from "store/userReducer"
import TopMenuProfile from "./TopMenuProfile"

const Header: React.FC = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const navigate = useNavigate();
    const curUser = useSelector(selectUser);

    function handleChange(event) {
        setSearchValue(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        navigate(`/search?query=${searchValue}`);
    }

    return (
        <header className="header">
            <div className="header_input_wrapper">
                <form onSubmit={handleSubmit}>
                    <input className="header_input" onChange={handleChange} value={searchValue}></input>
                </form >
            </div>
            {curUser && <div>
                {curUser.name}
            </div>}
            <TopMenuProfile />
            <div className="header_avatar">
                
            </div>
        </header>
    )
}


export default Header;