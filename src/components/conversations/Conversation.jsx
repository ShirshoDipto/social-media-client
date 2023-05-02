import "./conversation.css";

export default function Conversation({
  user,
  conversation,
  currentChat,
  setCurrentChat,
  getMessages,
}) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  let contact = conversation.members[0];
  if (user.user._id === conversation.members[0]._id) {
    contact = conversation.members[1];
  }

  const fullname = `${contact.firstName} ${contact.lastName}`;

  return (
    <div
      className={
        conversation._id === currentChat?._id
          ? "conversation active"
          : "conversation"
      }
      onClick={() => {
        if (!conversation.temp) {
          getMessages(conversation._id);
        }
        setCurrentChat(conversation);
      }}
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
        <div className="conversationLatest">{conversation.lastMsg}</div>
      </div>
    </div>
  );
}
