import "./profileFriend.css";
import { Link } from "react-router-dom";

export default function ProfileFriend({ fnd }) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  return (
    <div className="profileFriend">
      <img
        src={
          fnd.profilePic
            ? fnd.profilePic
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
