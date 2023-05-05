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
  const oldMsgRef = useRef();
  const newMsgRef = useRef();
  const unseenMsgRef = useRef();
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

  async function markUnseenAsSeen(conv) {
    try {
      const res = await fetch(
        `${serverRoot}/api/messenger/conversations/${conv._id}/messages/markAsSeen`,

        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seenBy: [conv.members[0]._id, conv.members[1]._id],
          }),
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

  async function setNumUnseenToZero(convId) {
    const newConvs = conversations.map((conv) => {
      if (conv._id === convId) {
        const newConv = JSON.parse(JSON.stringify(conv));
        newConv.unseenMsgs.forEach((msg) => {
          if (msg.userId === user.user._id) {
            msg.numUnseen = 0;
          }
        });
        return newConv;
      }
      return conv;
    });

    setConversations(newConvs);
  }

  async function getMessages(conv) {
    const [unseen, old] = await Promise.all([
      getUnseenMsgs(conv._id),
      getOldMsgs(conv._id, 0),
    ]);

    const numUnseenMsgs = conv.unseenMsgs.find(
      (elem) => elem.userId === user.user._id && elem.numUnseen > 0
    );

    console.log(numUnseenMsgs);

    if (numUnseenMsgs) {
      markUnseenAsSeen(conv); // Happens asynchronously. Beacuse I don't have to wait for it to finish before rendering....
      setNumUnseenToZero(conv._id);
    }

    setUnseenMsgs(unseen);
    setOldMsgs(old);
    setNewMsgs([]);
  }

  async function updateConvsForNewMsg(newMessage) {
    const newConversations = conversations.map((conv) => {
      if (newMessage.conversationId === conv._id) {
        const newConv = JSON.parse(JSON.stringify(conv));
        newConv.lastMsg = newMessage.content;
        newConv.updatedAt = new Date().toISOString();

        if (!newMessage.seenBy.includes(user.user._id)) {
          for (let msg of newConv.unseenMsgs) {
            if (msg.userId === user.user._id) {
              msg.numUnseen += 1;
            }
          }
        }

        return newConv;
      }

      return conv;
    });

    const sortedConv = newConversations.sort((a, b) => {
      if (b.updatedAt > a.updatedAt) {
        return 1;
      } else {
        return -1;
      }
    });

    setConversations(sortedConv);
  }

  async function sendSocketEvent(msgContent) {
    const receiver = currentChat.members.find(
      (member) => member._id !== user.user._id
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
      receiverId: receiver._id,
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
    await updateConvsForNewMsg(msg);
    e.target.reset();
  }

  async function changeCurrentChat(conv) {
    if (currentChat?._id === conv._id) {
      return;
    }

    socket.emit("currentChatActive", {
      userId: user.user._id,
      activeChat: conv,
    });

    getMessages(conv);
    setCurrentChat(conv);
  }

  useEffect(() => {
    function onConnectError(error) {
      console.log(error);
    }

    function onInternalError(error) {
      console.log(error);
    }

    function onGetMsg(msg) {
      updateConvsForNewMsg(msg);
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
  }, [currentChat, updateConvsForNewMsg]);

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

        socket.emit("currentChatActive", {
          userId: user.user._id,
          activeChat: chatToActive,
        });

        getMessages(chatToActive);
        setCurrentChat(chatToActive);
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
    socket.emit("messengerActive", user.user._id);

    return () => {
      socket.emit("messengerDeactive", user.user._id);
    };
  }, [user.user._id]);

  useEffect(() => {
    newMsgRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [newMsgs]);

  useEffect(() => {
    oldMsgRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [oldMsgs]);

  // useEffect(() => {
  //   unseenMsgRef.current?.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: "instant",
  //   });
  // }, [unseenMsgs]);

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
                    changeCurrentChat(conv);
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
                      <div key={msg._id} ref={oldMsgRef}>
                        <Message
                          own={msg.sender._id === user.user._id}
                          msg={msg}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="unseenMsgs">
                {unseenMsgs.length > 0 && (
                  <>
                    <div className="unseenMsgsText" ref={unseenMsgRef}>
                      <div />
                      <span>Unread Messages</span>
                      <div />
                    </div>
                    {unseenMsgs.map((msg) => {
                      return (
                        <div key={msg._id}>
                          <Message
                            own={msg.sender._id === user.user._id}
                            msg={msg}
                          />
                        </div>
                      );
                    })}
                    <div className="unseenMsgsText" ref={unseenMsgRef}>
                      <div />
                    </div>
                  </>
                )}
              </div>
              <div className="newMsgs">
                {newMsgs.length > 0 &&
                  newMsgs.map((msg) => {
                    return (
                      <div key={msg._id} ref={newMsgRef}>
                        <Message
                          own={msg.sender._id === user.user._id}
                          msg={msg}
                        />
                      </div>
                    );
                  })}
              </div>
              {/* <div className="scrollbarPosition" ref={newMsgRef}></div> */}
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
