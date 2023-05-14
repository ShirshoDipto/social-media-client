import "./friendReqNotifs.css";
import PersonIcon from "@mui/icons-material/Person";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useRef, useState } from "react";
import Notification from "../notification/Notification";
import { socket } from "../../socket";

export default function FriendReqNotifs({ user }) {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const [notifications, setNotifications] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  const fndReqConfirmed = (
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
  );

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
      setDropdownStatus(false);
    } catch (error) {
      console.log(error);
      const newNotifications = notifications.filter((n) => n._id !== notif._id);
      setNotifications(newNotifications);
      setDropdownStatus(false);
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
      setDropdownStatus(false);
      socket.emit("sendFndReq", resData.notification);
    } catch (error) {
      console.log(error);
      const newNotifications = notifications.filter((n) => n._id !== notif._id);
      setNotifications(newNotifications);
      setDropdownStatus(false);
    }
  }

  useEffect(() => {
    async function fetchFndReqNotifications() {
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
    }
    fetchFndReqNotifications().catch((err) => {
      console.log(err);
    });
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
        setNotifications((n) => [notif, ...n]);
      }
    }

    socket.on("getFndReq", onFndReq);

    return () => {
      socket.off("getFndReq", onFndReq);
    };
  }, []);

  return (
    <div className="notifContainer">
      {isConfirmed && fndReqConfirmed}
      <PersonIcon
        className="notificationIcon"
        ref={dropdownTrigger}
        onClick={() => {
          setDropdownStatus(!dropdownStatus);
        }}
      />
      {notifications?.length > 0 && (
        <span className="topbarIconBadge">{notifications.length}</span>
      )}
      {dropdownStatus && (
        <div className="notifDropDown" ref={dropdown}>
          {notifications?.length > 0 ? (
            <div className="notificationList">
              {notifications.map((notif) => {
                return (
                  <Notification
                    key={notif._id}
                    notif={notif}
                    acceptFriendRequest={acceptFriendRequest}
                    rejectFriendRequest={rejectFriendRequest}
                  />
                );
              })}
            </div>
          ) : (
            <div className="noNotifications">No friend requests</div>
          )}
        </div>
      )}
    </div>
  );
}
