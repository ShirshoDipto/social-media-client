import "./friendReq.css";
import PersonIcon from "@mui/icons-material/Person";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function FriendReq({ user }) {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  const fndReqConfirmed = (
    <div className="fndReqConfirmed">
      <span>Friend request accepted successfully</span>
    </div>
  );

  async function rejectFriendRequest(notif) {
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function acceptFriendRequest(notif) {
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        setIsConfirmed(false);
      }, 2000);
      console.log("Effect running...");
    }
  }, [isConfirmed]);

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
      setIsLoading(false);
    }
    fetchFndReqNotifications().catch((err) => {
      console.log(err);
    });
  }, []);

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
                        has sent you a friend request.
                      </div>
                      <div className="notifMsgOption">
                        <button
                          className="fndAccept"
                          onClick={() => {
                            acceptFriendRequest(notif);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="fndReject"
                          onClick={(e) => {
                            rejectFriendRequest(notif);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
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
