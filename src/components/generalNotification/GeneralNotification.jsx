import "./generalNotification.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../socket";

export default function GeneralNotification({ user }) {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const [notifications, setNotifications] = useState([]);
  const [isMarkingAsSeen, setIsMarkingAsSeen] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [numNotif, setNumNotif] = useState(0);

  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function fetchOldNotifications() {
    try {
      setIsFetchingMore(true);
      const res = await fetch(
        `${serverRoot}/api/notifications/oldNotifications?skip=${notifications.length}`,
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
    if (isMarked) {
      return;
    }

    setIsMarkingAsSeen(true);
    try {
      const res = await fetch(`${serverRoot}/api/notifications/markAllAsRead`, {
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

  useEffect(() => {
    async function fetchNewNotifications() {
      const res = await fetch(
        `${serverRoot}/api/notifications/newNotifications`,
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
    }

    fetchNewNotifications().catch((err) => {
      console.log(err);
    });
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
    function onNewPost(notif) {
      setNotifications((n) => [notif, ...n]);
      setNumNotif((n) => n + 1);
      setIsMarked(false);
    }

    socket.on("getPost", onNewPost);

    return () => {
      socket.off("getPost", onNewPost);
    };
  }, []);

  return (
    <div className="notifContainer">
      <NotificationsIcon
        className="notificationIcon"
        ref={dropdownTrigger}
        onClick={() => {
          if (dropdownStatus && notifications.length > 0) {
            setNotifications([]);
            setNumNotif(0);
          }
          setDropdownStatus(!dropdownStatus);
          markAllAsRead();
        }}
      />
      {numNotif > 0 && <span className="topbarIconBadge">{numNotif}</span>}
      {dropdownStatus && (
        <div className="notifDropDown" ref={dropdown}>
          {isMarkingAsSeen ? (
            <div className="markLoadingContainer">
              <CircularProgress
                size={15}
                className="searchLoading"
                disableShrink
              />
            </div>
          ) : notifications.length > 0 ? (
            <div className="genNotificationList">
              {notifications.map((notif) => {
                return (
                  <div key={notif._id} className="notificationItem">
                    <img
                      src={
                        notif.sender.profilePic
                          ? `${serverRoot}/images/${notif.sender.profilePic}`
                          : `${clientRoot}/assets/person/noAvatar.png`
                      }
                      alt=""
                      className="notifMsgLeft"
                    />

                    <div className="notifMsgRight">
                      <div className="notifMsgText">
                        <Link
                          className="routerLink"
                          to={`${clientRoot}/users/${notif.sender._id}`}
                        >
                          <b className="notifSenderName">{`${notif.sender.firstName} ${notif.sender.lastName}`}</b>
                        </Link>{" "}
                        {notif.notificationType === 1 &&
                          "has accepted your friend request"}
                        {notif.notificationType === 3 &&
                          "has uploaded a new post"}
                      </div>
                    </div>
                  </div>
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
          <div className="showOldNotif">
            <span onClick={fetchOldNotifications}>Show old notifications</span>
          </div>
        </div>
      )}
    </div>
  );
}
