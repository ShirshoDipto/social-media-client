import React from "react";
import { useParams } from "react-router-dom";
import ProfileContent from "../../components/profileContent/ProfileContent";
// import Topbar from "../../components/topbar/Topbar";

export default function ProfileContainer({ user }) {
  const params = useParams();
  return (
    <div>
      {/* <Topbar user={user} /> */}
      <ProfileContent key={params.userId} user={user} />
    </div>
  );
}
