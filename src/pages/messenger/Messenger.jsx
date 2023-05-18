import "./messenger.css";
import CircularProgress from "@mui/material/CircularProgress";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatBoxForm from "../../components/chatBoxForm/ChatBoxForm";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../../socket";
import * as apiCalls from "../../messengerApiCalls";

export default function Messenger({ user }) {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMsgs, setIsfetchingMsgs] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [unseenMsgs, setUnseenMsgs] = useState([]);
  const [newMsgs, setNewMsgs] = useState([]);
  const [oldMsgs, setOldMsgs] = useState([]);
  const oldMsgRef = useRef();
  const newMsgRef = useRef();
  const [hasUnseenMsgs, setHasUnseenMsgs] = useState(false);

  async function updateNumUnseenToZero(convId) {
    const newConvs = conversations.map((conv) => {
      if (conv._id === convId) {
        const newConv = JSON.parse(JSON.stringify(conv));
        newConv.unseenMsgs.forEach((msg) => {
          if (msg.userId === user.userInfo._id) {
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
      apiCalls.getUnseenMsgs(conv._id, user.token),
      apiCalls.getOldMsgs(conv._id, 0, user.token),
    ]);

    const numUnseenMsgs = conv.unseenMsgs.find(
      (elem) => elem.userId === user.userInfo._id && elem.numUnseen > 0
    );

    if (numUnseenMsgs) {
      apiCalls.markUnseenAsSeen(conv, user.token); // Asynchronous. Don't have to wait for it to finish before rendering....
      updateNumUnseenToZero(conv._id);
      setHasUnseenMsgs(true);
    }

    setUnseenMsgs(unseen);
    setOldMsgs(old);
    setNewMsgs([]);
  }

  // eslint-disable-next-line
  async function updateConvsForNewMsg(newMessage) {
    let hasUpdated = false;
    let newConversations = conversations.map((conv) => {
      if (newMessage.conversationId === conv._id) {
        const newConv = JSON.parse(JSON.stringify(conv));
        newConv.lastMsg = newMessage.content;
        newConv.updatedAt = new Date().toISOString();

        if (!newMessage.seenBy.includes(user.userInfo._id)) {
          for (let msg of newConv.unseenMsgs) {
            if (msg.userId === user.userInfo._id) {
              msg.numUnseen += 1;
            }
          }
        }

        hasUpdated = true;
        return newConv;
      }

      return conv;
    });

    if (!hasUpdated) {
      const conv = await apiCalls.fetchSingleConv(newMessage, user.token);
      newConversations = [conv, ...newConversations];
    }

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
      (member) => member._id !== user.userInfo._id
    );

    const msg = {
      _id: uuidv4(),
      conversationId: currentChat._id,
      sender: {
        _id: user.userInfo._id,
        firstName: user.userInfo.firstName,
        lastName: user.userInfo.lastName,
        profilePic: user.userInfo.profilePic,
      },
      content: msgContent,
      seenBy: [user.userInfo._id],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    socket.emit("sendMsg", {
      receiverId: receiver._id,
      msg,
    });

    return msg;
  }

  async function handleSubmit(e, msgContent) {
    const msg = await sendSocketEvent(msgContent);

    setNewMsgs([...newMsgs, msg]);
    await updateConvsForNewMsg(msg);
    e.target.reset();
  }

  async function changeCurrentChat(conv) {
    if (currentChat?._id === conv._id) {
      return;
    }

    setIsfetchingMsgs(true);
    socket.emit("currentChatActive", {
      userId: user.userInfo._id,
      activeChat: conv,
    });

    getMessages(conv);
    setCurrentChat(conv);
    setIsfetchingMsgs(false);
  }

  useEffect(() => {
    function onGetMsg(msg) {
      updateConvsForNewMsg(msg);
      if (msg.conversationId === currentChat?._id) {
        setNewMsgs((m) => [...m, msg]);
      }
    }

    socket.on("getMsg", onGetMsg);

    return () => {
      socket.off("getMsg", onGetMsg);
    };
  }, [currentChat, updateConvsForNewMsg]);

  useEffect(() => {
    // CAREFUL!! This effect will run twice on developement. Hence, two conversations.

    async function handleCurrentChat(converses) {
      if (window.location.search) {
        const url = new URL(window.location.href);
        const userId = url.searchParams.get("userId");
        let chatToActive = converses.find(
          (conv) =>
            conv.members[0]._id === userId || conv.members[1]._id === userId
        );

        if (!chatToActive) {
          chatToActive = await apiCalls.createNewConv(userId, user.token);
          setConversations([chatToActive, ...converses]);
        }

        socket.emit("currentChatActive", {
          userId: user.userInfo._id,
          activeChat: chatToActive,
        });

        getMessages(chatToActive);
        setCurrentChat(chatToActive);
      }
    }

    async function setUpMessenger() {
      try {
        const conversations = await apiCalls.fetchConversations(user.token);

        setConversations(conversations);
        await handleCurrentChat(conversations);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    setUpMessenger();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.emit("messengerActive", user.userInfo._id);

    return () => {
      socket.emit("messengerDeactive", user.userInfo._id);
    };
  }, [user.userInfo._id]);

  useEffect(() => {
    oldMsgRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [oldMsgs]);

  useEffect(() => {
    newMsgRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [newMsgs]);

  if (isLoading) {
    return (
      <div className="messengerContainer">
        <CircularProgress className="messengerLoading" disableShrink />
      </div>
    );
  }

  return (
    <div className="messengerContainer">
      <div className="conversations">
        <div className="conversationsWrapper">
          <div className="conversationContainer">
            {conversations.length === 0 && (
              <div className="noMsgContainer">
                <div className="selectChatText">No conversation available</div>
              </div>
            )}
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
      <div
        className="chatBox"
        onClick={() => {
          if (hasUnseenMsgs) {
            setHasUnseenMsgs(false);
          }
        }}
      >
        {!currentChat ? (
          conversations.length > 0 && (
            <div className="selectChatText">
              Select a conversation to start messaging
            </div>
          )
        ) : (
          <div className="chatBoxWrapper">
            <div className="chatBoxCenter">
              {oldMsgs.length === 0 &&
                newMsgs.length === 0 &&
                unseenMsgs.length === 0 &&
                !isFetchingMsgs && (
                  <div className="noMsgContainer">
                    <div className="selectChatText">
                      Write something to start a conversation
                    </div>
                  </div>
                )}
              {oldMsgs.length > 0 && (
                <div className="oldMsgs">
                  <div className="showMoreMsg">
                    <div></div>
                    <button
                      onClick={async () => {
                        const msgs = await apiCalls.getOldMsgs(
                          currentChat._id,
                          oldMsgs.length + unseenMsgs.length + newMsgs.length,
                          user.token
                        );
                        setOldMsgs([...msgs, ...oldMsgs]);
                      }}
                    >
                      Show More
                    </button>
                    <div></div>
                  </div>
                  {oldMsgs.map((msg) => {
                    return (
                      <div key={msg._id} ref={oldMsgRef}>
                        <Message
                          own={msg.sender._id === user.userInfo._id}
                          msg={msg}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {unseenMsgs.length > 0 && (
                <div className="unseenMsgs">
                  {hasUnseenMsgs && (
                    <div className="unseenMsgsText">
                      <div />
                      <span>Unread Messages</span>
                      <div />
                    </div>
                  )}
                  {unseenMsgs.map((msg) => {
                    return (
                      <div key={msg._id}>
                        <Message
                          own={msg.sender._id === user.userInfo._id}
                          msg={msg}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {newMsgs.length > 0 && (
                <div className="newMsgs">
                  {newMsgs.map((msg) => {
                    return (
                      <div key={msg._id} ref={newMsgRef}>
                        <Message
                          own={msg.sender._id === user.userInfo._id}
                          msg={msg}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <ChatBoxForm
              user={user}
              currentChat={currentChat}
              handleSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
