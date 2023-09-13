import "./notification.css";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";

export default function Notification({
  notif,
  acceptFriendRequest,
  rejectFriendRequest,
  handleDropdownClosure,
}) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const urlForLink =
    notif.notificationType === 2
      ? `${clientRoot}/messenger?userId=${notif.sender._id}`
      : `${clientRoot}/users/${notif.sender._id}`;

  const fullname = `${notif.sender.firstName} ${notif.sender.lastName}`;

  return (
    <div key={notif._id} className="notificationItem">
      <Link
        className="routerLink"
        to={`${clientRoot}/users/${notif.sender._id}`}
        onClick={handleDropdownClosure}
      >
        <img
          src={
            notif.sender.profilePic
              ? notif.sender.profilePic
              : `${clientRoot}/assets/person/noAvatar.png`
          }
          alt=""
          className="notifMsgLeft"
        />
      </Link>
      <div className="notifMsgRight">
        <Link
          className="routerLink"
          to={urlForLink}
          onClick={handleDropdownClosure}
        >
          <div className="notifMsgText">
            <b className="notifSenderName">{fullname}</b>{" "}
            {notif.notificationType === 0 && "has sent you a friend request"}
            {notif.notificationType === 1 && "has accepted your friend request"}
            {notif.notificationType === 2 && "sent a message"}
            {notif.notificationType === 3 && "has uploaded a new post"}
          </div>
          <div className="notificationDate">
            <ReactTimeAgo date={new Date(notif.createdAt)} locale="en-US" />
          </div>
        </Link>
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
