import React from "react";
import Profile from "../../components/profile/Profile";
import Topbar from "../../components/topbar/Topbar";

export default function ProfileContainer({ user }) {
  return (
    <div>
      <Topbar user={user} />
      <Profile user={user} />
    </div>
  );
}
