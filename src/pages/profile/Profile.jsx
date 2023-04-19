import React from "react";
import ProfileContent from "../../components/profileContent/ProfileContent";
import Topbar from "../../components/topbar/Topbar";

export default function ProfileContainer({ user }) {
  return (
    <div>
      <Topbar user={user} />
      <ProfileContent user={user} />
    </div>
  );
}
