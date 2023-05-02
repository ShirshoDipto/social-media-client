import "./messengerContent.css";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import { useEffect, useRef, useState } from "react";
import SocketComponent from "../socketComponent/SocketComponent";
import { socket } from "../../socket";
import { v4 as uuidv4 } from "uuid";

export default function MessengerContent({ user }) {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  // const clientRoot = process.env.REACT_APP_CLIENTROOT;

  async function updateConversations(newMessage) {
    const newConversations = conversations.map((conv) => {
      if (newMessage.conversationId === conv._id) {
        const newConv = { ...conv };
        newConv.lastMsg = newMessage.content;
        return newConv;
      }

      return conv;
    });

    setConversations(newConversations);
  }

  async function addNewMessage(message) {
    message.sender = {
      _id: user.user._id,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      profilePic: user.user.profilePic,
    };

    setMessages([...messages, message]);
  }

  async function sendSocketEvent(msg) {
    const receiver = currentChat.members.find(
      (member) => member._id !== user.user._id
    );

    if (receiver) {
      msg.sender = {
        _id: user.user._id,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        profilePic: user.user.profilePic,
      };

      socket.emit("sendMsg", {
        receiverId: receiver._id,
        msg,
      });
    }
  }

  async function getMessages(conversationId) {
    try {
      const res = await fetch(
        `${serverRoot}/api/messenger/conversations/${conversationId}/messages?skip=0`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      setMessages(resData.messages);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = new URLSearchParams(formData);

    const res = await fetch(
      `${serverRoot}/api/messenger/conversations/${currentChat._id}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: data,
      }
    );

    const resData = await res.json();
    await sendSocketEvent(resData.message);

    await addNewMessage(resData.message);
    await updateConversations(resData.message);
    e.target.reset();
    if (!res.ok) {
      throw resData;
    }
  }

  useEffect(() => {
    function onGetMessage(msg) {
      updateConversations(msg);
      if (msg.conversationId === currentChat?._id) {
        setMessages((m) => [...m, msg]);
      }
    }

    socket.on("getMsg", onGetMessage);
    socket.on("connect_error", (err) => {
      console.log(err.message);
    });

    return () => {
      socket.off("connect_error");
      socket.off("getMsg", onGetMessage);
    };
  }, [currentChat, updateConversations]);

  useEffect(() => {
    async function createNewConv(userId) {
      const res = await fetch(`${serverRoot}/api/messenger/conversations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      return resData.conversation;
    }

    async function handleCurrentChat(converses) {
      if (window.location.search) {
        const url = new URL(window.location.href);
        const userId = url.searchParams.get("userId");
        let chatToActive = converses.find((conv) => {
          if (
            conv.members[0]._id === userId ||
            conv.members[1]._id === userId
          ) {
            return true;
          }
          return false;
        });

        if (!chatToActive) {
          chatToActive = await createNewConv(userId);
          setConversations([chatToActive, ...converses]);
        }

        setCurrentChat(chatToActive);
        getMessages(chatToActive._id);
      }
    }

    async function fetchConversations() {
      try {
        const res = await fetch(
          `${serverRoot}/api/messenger/conversations/${user.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        setConversations(resData.conversations);
        await handleCurrentChat(resData.conversations);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchConversations().catch((err) => {
      console.log(err);
    });
  }, [serverRoot, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="messenger">
        <CircularProgress className="messengerLoading" disableShrink />
      </div>
    );
  }

  return (
    <div className="messenger">
      {user && <SocketComponent />}
      <div className="conversations">
        <div className="conversationsWrapper">
          <input
            placeholder="Search for friends"
            className="coversationsInput"
          />
          <div className="conversationContainer">
            {conversations.map((conv) => {
              return (
                <Conversation
                  key={conv._id}
                  user={user}
                  conversation={conv}
                  currentChat={currentChat}
                  getMessages={getMessages}
                  setCurrentChat={setCurrentChat}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="chatBox">
        {!currentChat ? (
          <div className="selectChatText">Select a chat to start messaging</div>
        ) : (
          <div className="chatBoxWrapper">
            <div className="chatBoxTop"></div>
            <div className="chatBoxCenter">
              {messages.length > 0 &&
                messages.map((message) => {
                  return (
                    <div key={message._id}>
                      <Message
                        own={message.sender._id === user.user._id}
                        message={message}
                      />
                    </div>
                  );
                })}
              <div className="scrollbarPosition" ref={scrollRef}></div>
            </div>
            <form
              className="chatBoxBottom"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <input
                type="text"
                className="messageInput"
                placeholder="Type a message"
                name="content"
              />
              <button className="msgInputButton">
                <SendIcon className="sendIcon" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
