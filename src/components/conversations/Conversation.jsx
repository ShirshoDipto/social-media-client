import "./conversation.css";
import { socket } from "../../socket";
import { useEffect, useState } from "react";

export default function Conversation({ user, conversation, currentChat }) {
  const [isActive, setIsActive] = useState(null);
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  const unseenMsgs = conversation.unseenMsgs.find(
    (msg) => msg.userId === user.userInfo._id
  );

  const contact = conversation.members.find(
    (member) => member._id !== user.userInfo._id
  );

  const fullname = `${contact.firstName} ${contact.lastName}`;

  useEffect(() => {
    function onUserStatus({ userId, status }) {
      if (userId === contact._id) {
        setIsActive(status);
      }
    }

    socket.on("receiveUserStatus", onUserStatus);
    socket.emit("getUserStatus", contact);

    return () => {
      socket.off("receiveUserStatus", onUserStatus);
    };
  }, [contact]);

  return (
    <div
      className={
        conversation._id === currentChat?._id
          ? "conversation active"
          : "conversation"
      }
    >
      <div className="convImgContainer">
        <img
          src={
            contact.profilePic
              ? contact.profilePic
              : `${clientRoot}/assets/person/noAvatar.png`
          }
          alt=""
          className="conversationImg"
        />

        <span
          className={isActive ? "convUserOnline" : "convUserOffline"}
        ></span>
      </div>
      <div className="conversationTexts">
        <div className="conversationName">{fullname}</div>
        <div className="convLatestContainer">
          <div className="conversationLatest">{conversation.lastMsg}</div>
          {unseenMsgs.numUnseen > 0 && (
            <div className="unseenMsgsNum">
              <span>{unseenMsgs.numUnseen}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
