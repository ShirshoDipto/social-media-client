import React from "react";
import Profile from "../../pages/profile/Profile";
import Topbar from "../topbar/Topbar";

export default function ProfileContainer({ user }) {
  return (
    <div>
      <Topbar user={user} />
      <Profile user={user} />
    </div>
  );
}
