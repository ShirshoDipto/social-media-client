import "./conversation.css";

export default function Conversation({ user, conversation, currentChat }) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  const unseenMsgs = conversation.unseenMsgs.find(
    (msg) => msg.userId === user.userInfo._id
  );

  const contact = conversation.members.find(
    (member) => member._id !== user.userInfo._id
  );

  const fullname = `${contact.firstName} ${contact.lastName}`;

  return (
    <div
      className={
        conversation._id === currentChat?._id
          ? "conversation active"
          : "conversation"
      }
    >
      <img
        src={
          contact.profilePic
            ? `${serverRoot}/images/${contact.profilePic}`
            : `${clientRoot}/assets/person/noAvatar.png`
        }
        alt=""
        className="conversationImg"
      />
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
