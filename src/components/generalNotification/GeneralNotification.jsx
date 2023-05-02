import "./generalNotification.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function GeneralNotification({ user }) {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [numNotif, setNumNotif] = useState(0);

  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function fetchOldNotifications() {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function markAllAsRead() {
    if (isMarked || notifications.length === 0) {
      return;
    }
    setIsLoading(true);
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

      setIsLoading(false);
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
  }, [user.token]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        !dropdownTrigger.current.contains(e.target)
      ) {
        setDropdownStatus(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="notifContainer">
      <NotificationsIcon
        className="notificationIcon"
        ref={dropdownTrigger}
        onClick={() => {
          setDropdownStatus(!dropdownStatus);
          markAllAsRead();
        }}
      />
      {numNotif > 0 && <span className="topbarIconBadge">{numNotif}</span>}
      {dropdownStatus && (
        <div className="notifDropDown" ref={dropdown}>
          {notifications.length > 0 ? (
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
                        if your friend now.
                      </div>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="markLoadingContainer">
                  <CircularProgress
                    size={15}
                    className="searchLoading"
                    disableShrink
                  />
                </div>
              )}

              <div className="showOldNotif">
                <span onClick={fetchOldNotifications}>
                  Show old notifications
                </span>
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="markLoadingContainer">
                  <CircularProgress
                    size={15}
                    className="searchLoading"
                    disableShrink
                  />
                </div>
              ) : (
                <div className="noNotifications">No new notifications</div>
              )}
              <div className="showOldNotif">
                <span onClick={fetchOldNotifications}>
                  Show old notifications
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
