import { GetUserDto } from "@common/dto/user.dto";
import { api } from "api/Api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilePage: React.FC<{ self?: boolean }> = ({ self = false }) => {
    const { profileId } = useParams();
    const [user, setUser] = useState<GetUserDto>();

    useEffect(() => {
        if (!self) {
            api.getUserById(profileId).then(([response, _]) => {
                setUser(response);
            })
        } else {
            api.getProfile().then(([response, _]) => {
                setUser(response);
            })
        }
    }, [])

    return user ? (
        <>
            <h2>Профиль</h2>
            <h4>Имя:</h4>
            <h5>{user.name}</h5>
            <h4>Email:</h4>
            <h5>{user.email}</h5>
        </>
    ) : null
}

export default ProfilePage;