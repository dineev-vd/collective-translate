import "./Header.css"
import { } from "@blueprintjs/core"
import React, { FormEvent } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "api/Api"

const Header: React.FC = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const navigate = useNavigate();

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
            <div className="header_avatar">
                
            </div>
        </header>
    )
}


export default Header;