import "./friendshipStatus.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function FriendshipStatus({
  user,
  userBio,
  friendship,
  setFriendship,
}) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  let friendshipStatusText;
  const fullname = userBio.firstName + " " + userBio.lastName;

  async function handleFriendship() {
    console.log("Handling...");
  }

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

      setFriendship(resData.friendship);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelFriendRequest() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friendships/${friendship._id}/cancel`,
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

      setFriendship(resData.friendship);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function rejectFriendRequest() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friendships/${friendship._id}`,
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

      setFriendship(null);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function acceptFriendRequest() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friendships/${friendship._id}`,
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

      window.location.reload();
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

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  function getFriendshipUI() {
    if (!friendship) {
      return (
        <div className="friendshipStatus" onClick={sendFriendRequest}>
          <PersonAddIcon />
          <span className="friendship">Add Friend</span>
        </div>
      );
    }

    if (friendship.status === 1) {
      friendshipStatusText = `You are friends with ${fullname}`;
      return (
        <div className="friendshipStatus" onClick={removeFromFriendList}>
          <PersonRemoveIcon />
          <span className="friendship">Remove From Friend List</span>
        </div>
      );
    }

    if (
      friendship.status === 0 &&
      friendship.requester.toString() === user.user._id.toString()
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
      friendship.status === 0 &&
      friendship.recipient.toString() === user.user._id.toString()
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
        <div className="messageContainer">
          <MessageOutlinedIcon />
          <span className="messageText">Message</span>
        </div>
      </div>
    </div>
  );
}
