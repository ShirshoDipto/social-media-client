import "./friendReqNotifs.css";
import PersonIcon from "@mui/icons-material/Person";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useRef, useState } from "react";
import Notification from "../notification/Notification";
import { socket } from "../../socket";

export default function FriendReqNotifs({ user, updateUnseenNotifs }) {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const [notifications, setNotifications] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function rejectFriendRequest(notif) {
    try {
      const res = await fetch(
        `${serverRoot}/api/users/${notif.sender._id}/friendships/${notif.friendshipId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      const newNotifications = notifications.filter((n) => n._id !== notif._id);
      setNotifications(newNotifications);
    } catch (error) {
      console.log(error);
      const newNotifications = notifications.filter((n) => n._id !== notif._id);
      setNotifications(newNotifications);
    }
  }

  async function acceptFriendRequest(notif) {
    try {
      const res = await fetch(
        `${serverRoot}/api/users/${notif.sender._id}/friendships/${notif.friendshipId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      const newNotifications = notifications.filter((n) => n._id !== notif._id);
      setNotifications(newNotifications);
      setIsConfirmed(true);
      socket.emit("sendFndReq", resData.notification);
    } catch (error) {
      console.log(error);
      const newNotifications = notifications.filter((n) => n._id !== notif._id);
      setNotifications(newNotifications);
    }
  }

  async function handleDropdownClosure() {
    setDropdownStatus(false);
  }

  useEffect(() => {
    async function fetchFndReqNotifications() {
      try {
        const res = await fetch(`${serverRoot}/api/notifications/fndReq`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        setNotifications(resData.notifications);
      } catch (error) {
        console.log(error);
      }
    }

    fetchFndReqNotifications();
  }, [serverRoot, user.token]);

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

  useEffect(() => {
    function onFndReq(notif) {
      if (notif.notificationType === 0) {
        const existingNotif = notifications.find(
          (n) => n.sender._id === notif.sender._id
        );

        if (!existingNotif) {
          setNotifications((n) => [notif, ...n]);
        }
      }
    }

    function onDeleteNotif(notifId) {
      const newNotifications = notifications.filter((n) => n._id !== notifId);
      setNotifications(newNotifications);
    }

    socket.on("getFndReq", onFndReq);
    socket.on("deleteNotif", onDeleteNotif);

    updateUnseenNotifs("fndReq", notifications.length);

    return () => {
      socket.off("getFndReq", onFndReq);
      socket.off("deleteNotif", onDeleteNotif);
    };
    // eslint-disable-next-line
  }, [notifications]);

  return (
    <div className="notifContainer">
      {isConfirmed && (
        <div className="fndReqConfirmed">
          <Snackbar
            open={isConfirmed}
            autoHideDuration={3000}
            onClose={() => setIsConfirmed(false)}
          >
            <Alert
              onClose={() => setIsConfirmed(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Friend request accepted successfully
            </Alert>
          </Snackbar>
        </div>
      )}
      <div
        className="topbarIconContainer"
        ref={dropdownTrigger}
        onClick={() => {
          setDropdownStatus(!dropdownStatus);
        }}
      >
        <PersonIcon className="fndReqNotificationIcon" />
      </div>
      {notifications?.length > 0 && (
        <span className="topbarIconBadge">{notifications.length}</span>
      )}
      {dropdownStatus && (
        <div className="fndNotifDropDown" ref={dropdown}>
          {notifications?.length > 0 ? (
            <div className="notificationList">
              {notifications.map((notif) => {
                return (
                  <Notification
                    key={notif._id}
                    notif={notif}
                    acceptFriendRequest={acceptFriendRequest}
                    rejectFriendRequest={rejectFriendRequest}
                    handleDropdownClosure={handleDropdownClosure}
                  />
                );
              })}
            </div>
          ) : (
            <div className="noFndNotifications">No friend requests</div>
          )}
        </div>
      )}
    </div>
  );
}
