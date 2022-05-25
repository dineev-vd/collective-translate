import { api } from "api/Api";
import UserProjectList from "components/project/ProjectList";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import UserInfo from "components/UserInfo";
import { BaseAPI, GetUserDto } from "gen";

const ProfilePage: React.FC = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState<GetUserDto>();

  useEffect(() => {
    console.log(profileId);

    if (profileId !== "me") {
      api.getUserById(profileId).then(([response, _]) => {
        setUser(response);
      });
    } else {
      api.userControllerGetProfile().then((response) => {
        setUser(response);
        console.log(response);
      });
    }
  }, []);

  return user ? (
    <>
      <Routes>
        <Route path="details" element={<UserInfo user={user} />} />
        <Route index element={<Navigate to={"details"} />} />
        <Route
          path="projects"
          element={<UserProjectList userId={user.id.toString()} />}
        />
      </Routes>
    </>
  ) : null;
};

export default ProfilePage;
