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
  comments,
  setComments,
}) {
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const updatedCommentContent = useRef();

  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [numLikes, setNumLikes] = useState(comment.numLikes);
  const [isLiked, setIsLiked] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  const fullname = `${comment.author.firstName} ${comment.author.lastName}`;

  async function addLike() {
    try {
      const res = await fetch(
        `${serverRoot}/api/home/comments/${comment._id}/likes`,
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

      return resData.commentLike;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteLike() {
    try {
      const res = await fetch(
        `${serverRoot}/api/home/comments/${comment._id}/likes/${isLiked._id}`,
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
    } catch (error) {
      console.log(error);
    }
  }

  async function handleToggleLike() {
    if (!user) {
      return alert("Log in to Like and Comment");
    }

    if (Object.keys(isLiked).length !== 0) {
      if (isLoading) {
        return alert("You have already unliked the comment");
      }
      setIsLoading(true);
      await deleteLike();
      setNumLikes(numLikes - 1);
      setIsLiked({});
      setIsLoading(false);
    } else {
      if (isLoading) {
        return alert("You have already liked the comment");
      }
      setIsLoading(true);
      const commentLike = await addLike();
      setNumLikes(numLikes + 1);
      setIsLiked(commentLike);
      setIsLoading(false);
    }
  }

  async function replaceComment(commentContent) {
    const newComments = comments.map((c) => {
      if (comment._id !== c._id) {
        return c;
      }

      const newComment = { ...comment };
      newComment.content = commentContent;
      return newComment;
    });

    return newComments;
  }

  async function updateComment(e) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = new URLSearchParams(formData);

      const res = await fetch(
        `${serverRoot}/api/home/posts/${post._id}/comments/${comment._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: data,
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      const newComments = await replaceComment(
        updatedCommentContent.current.value
      );
      setComments(newComments);
      setIsUpdating(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment() {
    try {
      const res = await fetch(
        `${serverRoot}/api/home/posts/${post._id}/comments/${comment._id}`,
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

      const newComments = comments.filter((c) => c._id !== comment._id);
      setComments(newComments);
      setNumComments(resData.numComments);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function fetchUserLike() {
      try {
        const res = await fetch(
          `${serverRoot}/api/home/comments/${comment._id}/likes`,
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

        if (resData.error) {
          return;
        }

        setIsLiked(resData.commentLike);
      } catch (error) {
        console.log(error);
      }
    }

    if (user && !comment.isNew) {
      fetchUserLike();
    }
    // eslint-disable-next-line
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

  return (
    <div className="commentWrapper">
      <img
        src={
          comment.author.profilePic
            ? comment.author.profilePic
            : `${clientRoot}/assets/person/noAvatar.png`
        }
        alt=""
        className="commentUserImg"
      />

      <div className="commentRightContainer">
        <div className="commentUserNameAndComment">
          <div className="commentUserAndOptions">
            <Link to={`${clientRoot}/users/${comment.author._id}`}>
              <div className="commentUsername">{fullname}</div>
            </Link>
            {user && user.userInfo._id === comment.author._id && (
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
                      onClick={() => {
                        setDropdownStatus(false);
                        setIsUpdating(true);
                      }}
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
            <form className="updateFormContainer" onSubmit={updateComment}>
              <textarea
                name="content"
                className="commentUpdateTextarea"
                ref={updatedCommentContent}
                defaultValue={comment.content}
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
              {parse(comment.content.replace(/\n\r?/g, "<br />"))}
            </div>
          )}
        </div>
        <div className="commentLikeAndReplies">
          <span
            className={
              Object.keys(isLiked).length !== 0
                ? "commentLike commentLiked"
                : "commentLike"
            }
            onClick={handleToggleLike}
          >
            Like({numLikes})
          </span>
          <span className="commentDate">
            {<ReactTimeAgo date={new Date(comment.createdAt)} />}
          </span>
        </div>
      </div>
    </div>
  );
}
