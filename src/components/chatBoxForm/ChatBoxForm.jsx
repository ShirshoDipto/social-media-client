import "./chatBoxForm.css";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";

export default function ChatBoxForm({ user, currentChat, handleSubmit }) {
  const [isTyping, setIsTyping] = useState(false);
  const msgContent = useRef();

  let contact = currentChat.members.find(
    (member) => member._id !== user.user._id
  );

  let timeout = null;

  async function sendTypingEvent(e) {
    if (!timeout) {
      socket.emit("sendTyping", {
        receiverId: contact._id,
        chatId: currentChat._id,
      });
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      socket.emit("stopTyping", {
        receiverId: contact._id,
        chatId: currentChat._id,
      });
    }, 2000);
  }

  useEffect(() => {
    function onTyping() {
      setIsTyping(true);
    }

    function onGetMsg() {
      setIsTyping(false);
    }

    function onStoppedTyping() {
      setIsTyping(false);
    }

    socket.on("getTyping", onTyping);
    socket.on("getMsg", onGetMsg);
    socket.on("stoppedTyping", onStoppedTyping);

    return () => {
      socket.off("getTyping", onTyping);
      socket.off("getMsg", onGetMsg);
      socket.off("stoppedTyping", onStoppedTyping);
    };
  }, []);

  return (
    <form
      className="chatBoxForm"
      onSubmit={(e) => {
        e.preventDefault();
        if (msgContent.current.value.length === 0) {
          return;
        }
        handleSubmit(e, msgContent.current.value);
      }}
      autoComplete="off"
    >
      <div className="isTyping">
        {isTyping && <span>{contact.firstName} is typing ...</span>}
      </div>
      <div className="formInputContainer">
        <input
          ref={msgContent}
          type="text"
          className="messageInput"
          placeholder="Type a message"
          name="content"
          onChange={(e) => sendTypingEvent(e)}
        />
        <button className="msgInputButton">
          <SendIcon className="sendIcon" />
        </button>
      </div>
    </form>
  );
}
