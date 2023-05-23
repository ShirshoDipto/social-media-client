import "./message.css";
import ReactTimeAgo from "react-time-ago";

export default function Message({ own, msg }) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  return (
    <div className={own ? "message own" : "message"}>
      {!own && (
        <img
          className="messageImg"
          src={
            msg.sender.profilePic
              ? msg.sender.profilePic
              : `${clientRoot}/assets/person/noAvatar.png`
          }
          alt=""
        />
      )}
      <div className={own ? "messageDetails own" : "messageDetails"}>
        <span className="senderDetail">
          {!own && msg.sender.firstName}
          {!own && ", "}
          <ReactTimeAgo date={new Date(msg.createdAt)} locale="en-US" />
        </span>
        <p className={own ? "msgText own" : "msgText"}>{msg.content}</p>
      </div>
    </div>
  );
}
