import { Link } from "react-router-dom";
import "./notification.css";

export default function Notification({
  notif,
  acceptFriendRequest,
  rejectFriendRequest,
  setDropdownStatus,
}) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  const fullname = `${notif.sender.firstName} ${notif.sender.lastName}`;

  return (
    <div key={notif._id} className="notificationItem">
      <img
        src={
          notif.sender.profilePic
            ? `${serverRoot}/images/${notif.sender.profilePic}`
            : `${clientRoot}/assets/person/noAvatar.png`
        }
        alt=""
        className="notifMsgLeft"
      />
      <div className="notifMsgRight">
        <div className="notifMsgText">
          <Link
            className="routerLink"
            to={`${clientRoot}/users/${notif.sender._id}`}
          >
            <b
              className="notifSenderName"
              onClick={() => setDropdownStatus(false)}
            >
              {fullname}
            </b>
          </Link>{" "}
          {notif.notificationType === 0 && "has sent you a friend request"}
          {notif.notificationType === 1 && "has accepted your friend request"}
          {notif.notificationType === 2 && "sent a message"}
          {notif.notificationType === 3 && "has uploaded a new post"}
        </div>
        {notif.notificationType === 0 && (
          <div className="notifMsgOption">
            <button
              className="fndAccept"
              onClick={() => {
                acceptFriendRequest(notif);
              }}
            >
              Accept
            </button>
            <button
              className="fndReject"
              onClick={(e) => {
                rejectFriendRequest(notif);
              }}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
