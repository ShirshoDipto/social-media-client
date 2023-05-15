import "./commentContent.css";
import ReactTimeAgo from "react-time-ago";
import { useEffect, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

export default function CommentContent({
  user,
  comment,
  post,
  setNumComments,
}) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const updatedCommentContent = useRef();
  const [commentState, setCommentState] = useState(comment);
  const [isLiked, setIsLiked] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const fullname = `${commentState.author.firstName} ${commentState.author.lastName}`;

  async function addLike() {
    try {
      const res = await fetch(
        `${serverRoot}/api/comments/${commentState._id}/likes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        return console.log(await res.json());
      }

      const resData = await res.json();
      setCommentState({
        ...commentState,
        numLikes: commentState.numLikes + 1,
      });
      setIsLiked(resData.commentLike);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteLike() {
    try {
      const res = await fetch(
        `${serverRoot}/api/comments/${commentState._id}/likes/${isLiked._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        return console.log(await res.json());
      }

      setCommentState({
        ...commentState,
        numLikes: commentState.numLikes - 1,
      });
      setIsLiked({});
    } catch (error) {
      console.log(error);
    }
  }

  async function handleToggleLike() {
    try {
      if (!user) {
        return alert("Log in to Like and Comment");
      }

      if (Object.keys(isLiked).length !== 0) {
        return await deleteLike();
      } else {
        await addLike();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function toggleIsUpdating() {
    setDropdownStatus(false);
    setIsUpdating(true);
  }

  async function updatePost(e) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = new URLSearchParams(formData);

      const res = await fetch(
        `${serverRoot}/api/posts/${post._id}/comments/${commentState._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: data,
        }
      );

      if (!res.ok) {
        return console.log(await res.json());
      }

      setCommentState({
        ...commentState,
        content: updatedCommentContent.current.value,
      });
      setIsUpdating(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment() {
    try {
      const res = await fetch(
        `${serverRoot}/api/posts/${post._id}/comments/${commentState._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        return console.log(await res.json());
      }

      const resData = await res.json();

      setIsDeleted(true);
      setNumComments(resData.numComments);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function fetchUserLike() {
      try {
        if (!user) {
          return;
        }

        const res = await fetch(
          `${serverRoot}/api/comments/${comment._id}/likes`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!res.ok) {
          return console.log(await res.json());
        }

        const resData = await res.json();

        if (resData.error) {
          return;
        }

        setIsLiked(resData.commentLike);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserLike();
  }, [comment._id, serverRoot, user]);

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

  if (isDeleted) {
    return null;
  }

  return (
    <div className="commentWrapper">
      {commentState.author.profilePic ? (
        <img
          src={`${serverRoot}/images/${commentState.author.profilePic}`}
          alt=""
          className="commentUserImg"
        />
      ) : (
        <img
          src={`${clientRoot}/assets/person/noAvatar.png`}
          alt=""
          className="commentUserImg"
        />
      )}

      <div className="commentRightContainer">
        <div className="commentUserNameAndComment">
          <div className="commentUserAndOptions">
            <Link to={`${clientRoot}/users/${commentState.author._id}`}>
              <div className="commentUsername">{fullname}</div>
            </Link>
            {user && user.userInfo._id === commentState.author._id && (
              <div className="commentDropdownContainer">
                <div
                  className="commentMoreVertContainer"
                  ref={dropdownTrigger}
                  onClick={() => setDropdownStatus(!dropdownStatus)}
                >
                  <MoreVertIcon sx={{ fontSize: 15 }} className="moreVert" />
                </div>
                {dropdownStatus && (
                  <ul className="commentDropdown" ref={dropdown}>
                    <li
                      className="commentDropdownItem"
                      onClick={toggleIsUpdating}
                    >
                      <EditIcon className="commentDropdownIcon" />
                      <span className="commentDropdownItemText">Update</span>
                    </li>
                    <li className="commentDropdownItem" onClick={deleteComment}>
                      <DeleteIcon className="commentDropdownIcon" />
                      <span className="commentDropdownItemText">Delete</span>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
          {isUpdating ? (
            <form className="updateFormContainer" onSubmit={updatePost}>
              <textarea
                name="content"
                className="commentUpdateTextarea"
                ref={updatedCommentContent}
                defaultValue={commentState.content}
                autoFocus={true}
                required={true}
              ></textarea>
              <div className="updateFormButtonContainer">
                <span
                  className="commentUpdateCancel"
                  onClick={() => setIsUpdating(false)}
                >
                  Cancel
                </span>
                <button className="updateFormButton">Update</button>
              </div>
            </form>
          ) : (
            <div className="commentRightContent">
              {parse(commentState.content.replace(/\n\r?/g, "<br />"))}
            </div>
          )}
        </div>
        <div className="commentLikeAndReplies">
          {Object.keys(isLiked).length !== 0 ? (
            <span
              className="commentLike commentLiked"
              onClick={handleToggleLike}
            >
              Like({commentState.numLikes})
            </span>
          ) : (
            <span className="commentLike" onClick={handleToggleLike}>
              Like({commentState.numLikes})
            </span>
          )}
          <span className="commentDate">
            {<ReactTimeAgo date={new Date(commentState.createdAt)} />}
          </span>
        </div>
      </div>
    </div>
  );
}
