import "./newMsgNotifs.css";
// import ChatIcon from "@mui/icons-material/Chat";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../socket";
import Notification from "../notification/Notification";

export default function NewMsg({ user, updateUnseenNotifs }) {
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
  }, [notifications]);

  useEffect(() => {
    updateUnseenNotifs("msg", numNotif);

    // eslint-disable-next-line
  }, [numNotif]);

  return (
    <div className="notifContainer">
      <div
        className="topbarIconContainer"
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
        {/* <ChatIcon className="msgNotificationIcon" /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          style={{
            fill: "rgba(176, 179, 184, 1)",
            transform: "",
            msFilter: "",
          }}
          className="msgNotificationIcon"
        >
          <path d="M12 3c-4.92 0-8.91 3.729-8.91 8.332 0 2.616 1.291 4.952 3.311 6.479V21l3.041-1.687c.811.228 1.668.35 2.559.35 4.92 0 8.91-3.73 8.91-8.331C20.91 6.729 16.92 3 12 3zm.938 11.172-2.305-2.394-4.438 2.454 4.865-5.163 2.305 2.395 4.439-2.455-4.866 5.163z"></path>
        </svg>
      </div>

      {numNotif > 0 && <span className="topbarIconBadge">{numNotif}</span>}
      {dropdownStatus && (
        <div className="msgNotifDropDown" ref={dropdown}>
          <div className="msgNotifDropdownWrapper">
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
              <div className="noMsgNotifications">No new messages</div>
            )}
            {isFetchingMore ? (
              <div className="markLoadingContainer">
                <CircularProgress
                  size={15}
                  className="searchLoading"
                  disableShrink
                />
              </div>
            ) : (
              <div
                className="msgShowOldNotif"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchOldNotifications();
                }}
              >
                <span>Show old notifications</span>
              </div>
            )}
          </div>

          <Link className="routerLink" to={`${clientRoot}/messenger`}>
            <div
              className="openMessenger"
              onClick={() => {
                if (notifications.length > 0) {
                  setNotifications([]);
                  setNumNotif(0);
                }
                setDropdownStatus(false);
              }}
            >
              <span>Open Messenger</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
