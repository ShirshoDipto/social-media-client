import { Link } from "react-router-dom";
import "./contact.css";

export default function Contact({ fnd, status }) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  const fullname = fnd.firstName + " " + fnd.lastName;

  return (
    <div className="contact">
      <div className="contactProfileImgContainer">
        <img
          src={
            fnd.profilePic
              ? fnd.profilePic
              : `${clientRoot}/assets/person/noAvatar.png`
          }
          alt=""
          className="contactProfileImg"
        />
        <span className={status ? "contactOnline" : "contactOffline"}></span>
      </div>
      <span className="contactUsername">
        <Link className="routerLink" to={`${clientRoot}/users/${fnd._id}`}>
          {fullname}
        </Link>
      </span>
    </div>
  );
}
