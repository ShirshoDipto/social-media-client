import "./newMsgNotifs.css";
import ChatIcon from "@mui/icons-material/Chat";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../socket";
import Notification from "../notification/Notification";

export default function NewMsg({ user }) {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const [notifications, setNotifications] = useState([]);
  const [isMarkingAsSeen, setIsMarkingAsSeen] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [numNotif, setNumNotif] = useState(0); // cannot use notifications.length.

  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function fetchOldNotifications() {
    try {
      setIsFetchingMore(true);
      const res = await fetch(
        `${serverRoot}/api/notifications/oldMsgNotifs?skip=${notifications.length}`,
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

      setNotifications([...notifications, ...resData.notifications]);
      setIsFetchingMore(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function markAllAsRead() {
    if (isMarked || notifications.length === 0) {
      return;
    }

    setIsMarkingAsSeen(true);
    try {
      const res = await fetch(`${serverRoot}/api/notifications/unseenMsgs`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      setIsMarkingAsSeen(false);
      setIsMarked(true);
      setNumNotif(0);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDropdownClosure() {
    if (notifications.length > 0) {
      setNotifications([]);
      setNumNotif(0);
    }

    setDropdownStatus(false);
  }

  useEffect(() => {
    async function fetchNewNotifications() {
      try {
        const res = await fetch(
          `${serverRoot}/api/notifications/newMsgNotifs`,
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

        setNotifications(resData.notifications);
        setNumNotif(resData.notifications.length);
      } catch (error) {
        console.log(error);
      }
    }

    fetchNewNotifications();
  }, [user.token, serverRoot]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        !dropdownTrigger.current.contains(e.target)
      ) {
        if (notifications.length > 0) {
          setNotifications([]);
          setNumNotif(0);
        }

        setDropdownStatus(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [notifications.length]);

  useEffect(() => {
    function onNewMsgNotif(notif) {
      setNotifications((n) => [notif, ...n]);
      setNumNotif((n) => n + 1);
      setIsMarked(false);
    }

    socket.on("newMsg", onNewMsgNotif);
    return () => {
      socket.off("newMsg", onNewMsgNotif);
    };
  }, []);

  return (
    <div
      className="notifContainer"
      ref={dropdownTrigger}
      onClick={() => {
        if (dropdownStatus && notifications.length > 0) {
          setNotifications([]);
          setNumNotif(0);
        }
        setDropdownStatus(!dropdownStatus);
        markAllAsRead();
      }}
    >
      <ChatIcon className="notificationIcon" />

      {numNotif > 0 && <span className="topbarIconBadge">{numNotif}</span>}
      {dropdownStatus && (
        <div className="msgNotifDropDown" ref={dropdown}>
          {isMarkingAsSeen ? (
            <div className="markLoadingContainer">
              <CircularProgress
                size={15}
                className="searchLoading"
                disableShrink
              />
            </div>
          ) : notifications.length > 0 ? (
            <div className="msgNotificationList">
              {notifications.map((notif) => {
                return (
                  <Notification
                    key={notif._id}
                    notif={notif}
                    handleDropdownClosure={handleDropdownClosure}
                  />
                );
              })}
            </div>
          ) : (
            <div className="noNotifications">No new notifications</div>
          )}
          {isFetchingMore && (
            <div className="markLoadingContainer">
              <CircularProgress
                size={15}
                className="searchLoading"
                disableShrink
              />
            </div>
          )}
          <div className="notifOptions">
            <Link className="routerLink" to={`${clientRoot}/messenger`}>
              <span
                onClick={() => {
                  if (notifications.length > 0) {
                    setNotifications([]);
                    setNumNotif(0);
                  }
                  setDropdownStatus(false);
                }}
              >
                Open Messenger
              </span>
            </Link>
            <span onClick={fetchOldNotifications}>Show old notifications</span>
          </div>
        </div>
      )}
    </div>
  );
}
