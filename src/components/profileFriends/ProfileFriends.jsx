import "./profileFriends.css";
import { Link } from "react-router-dom";

export default function ProfileFriends({ fnd }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  return (
    <div className="profileFriend">
      <img
        src={
          fnd.profilePic
            ? `${serverRoot}/images/${fnd.profilePic}`
            : `${clientRoot}/assets/person/noAvatar.png`
        }
        alt=""
        className="profileFriendImg"
      />

      <span className="profileFriendName">
        <Link className="routerLink" to={`${clientRoot}/users/${fnd._id}`}>
          {`${fnd.firstName} ${fnd.lastName}`}
        </Link>
      </span>
    </div>
  );
}
