import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import Topbar from "../../components/topbar/Topbar";
import SendIcon from "@mui/icons-material/Send";
import "./messenger.css";

export default function Messenger({ user }) {
  return (
    <div className="messengerContainer">
      <Topbar user={user} />
      <div className="messenger">
        <div className="conversations">
          <div className="conversationsWrapper">
            <input
              placeholder="Search for friends"
              className="coversationsInput"
            />
            <div className="conversationContainer">
              <Conversation />
              <Conversation />
              <Conversation />
              <Conversation />
              <Conversation />
              <Conversation />
            </div>
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop"></div>
            <div className="chatBoxCenter">
              <Message own={true} />
              <Message />
              <Message own={true} />
              <Message own={true} />
              <Message />
              <Message own={true} />
              <Message own={true} />
            </div>
            <form className="chatBoxBottom">
              <input
                type="text"
                className="messageInput"
                placeholder="Type a message"
              />
              <SendIcon className="sendIcon" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
