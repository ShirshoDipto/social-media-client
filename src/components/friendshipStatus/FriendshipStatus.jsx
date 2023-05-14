import "./friendshipStatus.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { socket } from "../../socket";

export default function FriendshipStatus({ user, userBio, friendship }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [fndshipState, setFndshipState] = useState(friendship);

  let friendshipStatusText;
  const fullname = userBio.firstName + " " + userBio.lastName;

  async function sendFriendRequest() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friendships`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      setFndshipState(resData.friendship);
      setIsLoading(false);
      socket.emit("sendFndReq", resData.notification);
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelFriendRequest() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friendships/${fndshipState._id}/cancel`,
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

      setFndshipState(resData.friendship);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function rejectFriendRequest() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friendships/${fndshipState._id}`,
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

      setFndshipState(null);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function acceptFriendRequest() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friendships/${fndshipState._id}`,
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

      setFndshipState(resData.friendship);
      setIsLoading(false);
      // socket.emit("sendFndReq", )
    } catch (error) {
      console.log(error);
    }
  }

  async function removeFromFriendList() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friends/`,
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

      setFndshipState(null);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  function getFriendshipUI() {
    if (!fndshipState) {
      return (
        <div className="friendshipStatus" onClick={sendFriendRequest}>
          <PersonAddIcon />
          <span className="friendship">Add Friend</span>
        </div>
      );
    }

    if (fndshipState.status === 1) {
      friendshipStatusText = `You are friends with ${fullname}`;
      return (
        <div className="friendshipStatus" onClick={removeFromFriendList}>
          <PersonRemoveIcon />
          <span className="friendship">Remove From Friend List</span>
        </div>
      );
    }

    if (
      fndshipState.status === 0 &&
      fndshipState.requester.toString() === user.userInfo._id.toString()
    ) {
      friendshipStatusText = `You sent a friend request to ${fullname}`;
      return (
        <div className="friendshipStatus" onClick={cancelFriendRequest}>
          <PersonRemoveIcon />
          <span className="friendship">Cancel Friend Request</span>
        </div>
      );
    }

    if (
      fndshipState.status === 0 &&
      fndshipState.recipient.toString() === user.userInfo._id.toString()
    ) {
      friendshipStatusText = `${fullname} sent you a friend request`;
      return (
        <div className="fndReqConfirmContainer">
          <div className="friendshipStatus" onClick={acceptFriendRequest}>
            <PersonAddIcon />
            <span className="friendship">Accept</span>
          </div>
          <div className="rejectFriendship" onClick={rejectFriendRequest}>
            <PersonRemoveIcon />
            <span className="friendship">Reject</span>
          </div>
        </div>
      );
    }
  }

  let friendshipStatusUi = getFriendshipUI();

  return (
    <div className="friendshipContainer">
      {isLoading && (
        <div className="fndshipUiLoadingContainer">
          <CircularProgress className="fndUiLoading" disableShrink size={20} />
        </div>
      )}
      <span className="friendshipStatusText">{friendshipStatusText}</span>
      <div className="statusAndMessage">
        {friendshipStatusUi}
        <Link
          className="routerLink"
          to={`${clientRoot}/messenger?userId=${params.userId}`}
        >
          <div className="messageContainer">
            <MessageOutlinedIcon />
            <span className="messageText">Message</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
