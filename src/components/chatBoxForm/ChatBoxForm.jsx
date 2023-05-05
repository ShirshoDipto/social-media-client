import "./chatBoxForm.css";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function ChatBoxForm({ user, currentChat, handleSubmit }) {
  const [msgContent, setMsgContent] = useState("");
  const [isContactTyping, setIsContactTyping] = useState(false);

  let contact = currentChat.members.find(
    (member) => member._id !== user.user._id
  );

  async function sendTypingEvent(e) {
    setMsgContent(e.target.value);
    socket.emit("sendTyping", {
      receiverId: contact._id,
      chatId: currentChat._id,
    });
  }

  useEffect(() => {
    function onTyping() {
      setIsContactTyping(true);
    }

    function onGetMsg() {
      setIsContactTyping(false);
    }

    socket.on("getTyping", onTyping);
    socket.on("getMsg", onGetMsg);

    return () => {
      socket.off("getTyping", onTyping);
      socket.off("getMsg", onGetMsg);
    };
  }, []);

  // useEffect(() => {
  //   if (isContactTyping) {
  //     setTimeout(() => {
  //       setIsContactTyping(false);
  //       console.log("set contact typing to false");
  //     }, 6000);
  //   }
  // }, [isContactTyping]);

  return (
    <form
      className="chatBoxForm"
      onSubmit={(e) => {
        if (msgContent.length === 0) {
          return;
        }
        handleSubmit(e, msgContent);
      }}
      autoComplete="off"
    >
      <div className="formInputContainer"></div>
      {isContactTyping && (
        <div className="isTyping">{contact.firstName} is typing...</div>
      )}
      <input
        type="text"
        className="messageInput"
        placeholder="Type a message"
        name="content"
        onChange={(e) => sendTypingEvent(e)}
      />
      <button className="msgInputButton">
        <SendIcon className="sendIcon" />
      </button>
    </form>
  );
}
