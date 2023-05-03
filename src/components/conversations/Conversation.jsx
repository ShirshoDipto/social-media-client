import "./conversation.css";

export default function Conversation({ user, conversation, currentChat }) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  let unseenMsgs = conversation.members[1].unseenMsgs;
  let contact = conversation.members[0].member;
  if (user.user._id === conversation.members[0].member._id) {
    contact = conversation.members[1].member;
    unseenMsgs = conversation.members[0].unseenMsgs;
  }

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
        <div className="convNameContainer">
          <div className="conversationName">{fullname}</div>
          {unseenMsgs > 0 && <div className="unseenMsgsNum">{unseenMsgs}</div>}
        </div>
        <div className="conversationLatest">{conversation.lastMsg}</div>
      </div>
    </div>
  );
}
