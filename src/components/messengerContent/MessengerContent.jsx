import "./messengerContent.css";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import { useEffect, useRef, useState } from "react";
import SocketComponent from "../socketComponent/SocketComponent";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../../socket";

export default function MessengerContent({ user }) {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [unseenMsgs, setUnseenMsgs] = useState([]);
  const [newMsgs, setNewMsgs] = useState([]);
  const [oldMsgs, setOldMsgs] = useState([]);
  const scrollRef = useRef();
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function getUnseenMsgs(convId) {
    try {
      const res = await fetch(
        `${serverRoot}/api/messenger/conversations/${convId}/messages/unseen`,
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

      return resData.messages;
    } catch (error) {
      console.log(error);
    }
  }

  async function getOldMsgs(convId, skipMsgs) {
    try {
      const res = await fetch(
        `${serverRoot}/api/messenger/conversations/${convId}/messages/seen?skip=${skipMsgs}`,
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

      return resData.messages;
    } catch (error) {
      console.log(error);
    }
  }

  async function getMessages(convId) {
    const [unseen, old] = await Promise.all([
      getUnseenMsgs(convId),
      getOldMsgs(convId, 0),
    ]);

    setUnseenMsgs(unseen);
    setOldMsgs(old);
  }

  async function updateConversations(newMessage) {
    const newConversations = conversations.map((conv) => {
      if (newMessage.conversationId === conv._id) {
        // const newConv = { ...conv };
        const newConv = JSON.parse(JSON.stringify(conv));
        newConv.lastMsg = newMessage.content;
        if (!newMessage.seenBy.includes(user.user._id)) {
          for (let member of newConv.members) {
            if (member.member._id === user.user._id) {
              member.unseenMsgs += 1;
            }
          }
        }
        return newConv;
      }

      return conv;
    });

    const sortedConv = newConversations.sort(
      (a, b) => a.updatedAt > b.updatedAt
    );

    setConversations(sortedConv);
  }

  async function sendSocketEvent(msgContent) {
    const receiver = currentChat.members.find(
      (m) => m.member._id !== user.user._id
    );

    const msg = {
      _id: uuidv4(),
      conversationId: currentChat._id,
      sender: {
        _id: user.user._id,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        profilePic: user.user.profilePic,
      },
      content: msgContent,
      seenBy: [user.user._id],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    socket.emit("sendMsg", {
      receiverId: receiver.member._id,
      msg,
    });

    return msg;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());

    const msg = await sendSocketEvent(formJson.content);
    setNewMsgs([...newMsgs, msg]);
    await updateConversations(msg);
    e.target.reset();
  }

  useEffect(() => {
    function onConnectError(error) {
      console.log(error);
    }

    function onInternalError(error) {
      console.log(error);
    }

    function onGetMsg(msg) {
      updateConversations(msg);
      if (msg.conversationId === currentChat?._id) {
        setNewMsgs((m) => [...m, msg]);
      }
    }

    socket.on("getMsg", onGetMsg);
    socket.on("internalError", onInternalError);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect_error", onConnectError);
      socket.off("getMsg", onGetMsg);
      socket.off("internalError", onInternalError);
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
            conv.members[0].member._id === userId ||
            conv.members[1].member._id === userId
          ) {
            return true;
          }
          return false;
        });

        if (!chatToActive) {
          chatToActive = await createNewConv(userId);
          setConversations([chatToActive, ...converses]);
        }

        socket.emit("currentChatActive", {
          userId: user.user._id,
          activeChat: chatToActive,
        });

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
  }, [newMsgs]);

  useEffect(() => {
    socket.emit("messengerActive", user.user._id);

    return () => {
      socket.emit("messengerDeactive", user.user._id);
    };
  }, [user.user._id]);

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
                <div
                  key={conv._id}
                  onClick={() => {
                    socket.emit("currentChatActive", {
                      userId: user.user._id,
                      activeChat: conv,
                    });
                    setCurrentChat(conv);
                    getMessages(conv._id);
                  }}
                >
                  <Conversation
                    user={user}
                    conversation={conv}
                    currentChat={currentChat}
                  />
                </div>
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
              <div className="oldMsgs">
                {oldMsgs.length > 0 &&
                  oldMsgs.map((msg) => {
                    return (
                      <div key={msg._id}>
                        <Message
                          own={msg.sender._id === user.user._id}
                          msg={msg}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="unseenMsgs">
                {unseenMsgs.length > 0 &&
                  unseenMsgs.map((msg) => {
                    return (
                      <div key={msg._id}>
                        <Message
                          own={msg.sender._id === user.user._id}
                          msg={msg}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="newMsgs">
                {newMsgs.length > 0 &&
                  newMsgs.map((msg) => {
                    return (
                      <div key={msg._id}>
                        <Message
                          own={msg.sender._id === user.user._id}
                          msg={msg}
                        />
                      </div>
                    );
                  })}
              </div>
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
