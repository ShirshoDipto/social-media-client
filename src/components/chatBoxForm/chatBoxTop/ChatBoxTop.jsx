import "./chatBoxTop.css";

export default function ChatBoxTop({ user, currentChat }) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  const contact = currentChat.members.find(
    (member) => member._id !== user.user._id
  );

  const contactFullName = contact.firstName + " " + contact.lastName;

  return (
    <div className="chatBoxTop">
      <div className="chatBoxTopLeft">
        <img
          src={
            contact.profilePic
              ? `${serverRoot}/images/${contact.profilePic}`
              : `${clientRoot}/assets/person/noAvatar.png`
          }
          alt=""
          className="topLeftProfilePic"
        />
        <div className="topLeftNameContainer">
          <div className="topLeftName">{contactFullName}</div>
          <div className="topLeftActiveStatus">
            <div className="topLeftActive"></div>
            <span className="topLeftActiveText">Active</span>
          </div>
        </div>
      </div>
      <div className="chatBoxTopRight"></div>
    </div>
  );
}
