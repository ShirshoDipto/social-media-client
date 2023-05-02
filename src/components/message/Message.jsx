import "./message.css";
import ReactTimeAgo from "react-time-ago";

export default function Message({ own, message }) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  return (
    <div className={own ? "message own" : "message"}>
      {!own && (
        <img
          className="messageImg"
          src={
            message.sender.profilePic
              ? `${serverRoot}/images/${message.sender.profilePic}`
              : `${clientRoot}/assets/person/noAvatar.png`
          }
          alt=""
        />
      )}
      <div className={own ? "messageDetails own" : "messageDetails"}>
        <span className="senderDetail">
          {!own && message.sender.firstName}
          {!own && ", "}
          <ReactTimeAgo date={new Date(message.createdAt)} locale="en-US" />
        </span>
        <p className={own ? "msgText own" : "msgText"}>{message.content}</p>
      </div>
    </div>
  );
}
