import "./profile.css";
import { useParams } from "react-router-dom";
import ProfileContent from "../../components/profileContent/ProfileContent";

export default function ProfileContainer({ user }) {
  const params = useParams();
  return <ProfileContent key={params.userId} user={user} />;
}
