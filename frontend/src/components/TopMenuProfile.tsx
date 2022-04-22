import { api } from "api/Api";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "store/userReducer";

const TopMenuProfile: React.FC = () => {
    const curUser = useSelector(selectUser);
    const dispatch = useDispatch();


    const [curEmail, setEmail] = useState<string>("");
    const [curPass, setPass] = useState<string>(""); 

    function handleLogin() {
        api.login(curEmail, curPass).then(([token, _]) => {
            localStorage.setItem("access_token", token.accessToken);
            api.getProfile().then(([user, _]) => {
                dispatch(setUser(user))
            })
        })
    }

    return <div style={{
        "position": "absolute",
        "display": !curUser ? "flex" : "none",
        "flexDirection": "column",
        "width": "auto",
        "direction": "ltr",
        "top": "48px",
        "overflow": "hidden",
        "right": 0,
        "backgroundColor": "lightgray",
        "padding": "5px",
    }}>
        email:
        <input onChange={e => setEmail(e.target.value)}></input>
        password:
        <input onChange={e => setPass(e.target.value)}></input>
        <button style={{"marginTop": "5px"}} onClick={() => handleLogin()}>Login</button>
    </div>
}

export default TopMenuProfile;