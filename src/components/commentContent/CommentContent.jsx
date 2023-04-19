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

  const [commentState, setCommentState] = useState({
    comment: comment,
    isLiked: {},
    isUpdating: false,
    isLoading: false,
  });

  const [isDeleted, setIsDeleted] = useState(false);

  async function addLike() {
    try {
      if (commentState.isLoading) {
        return;
      }

      const res = await fetch(
        `${serverRoot}/api/comments/${commentState.comment._id}/likes`,
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
      let newcomment = commentState.comment;
      newcomment.numLikes += 1;
      return setCommentState({
        comment: newcomment,
        isLiked: resData.commentLike,
        isUpdating: commentState.isUpdating,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteLike() {
    try {
      if (commentState.isLoading) {
        return;
      }

      const res = await fetch(
        `${serverRoot}/api/comments/${commentState.comment._id}/likes/${commentState.isLiked._id}`,
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

      let newcomment = commentState.comment;
      newcomment.numLikes -= 1;
      return setCommentState({
        comment: newcomment,
        isLiked: {},
        isUpdating: commentState.isUpdating,
        isLoading: commentState.isLoading,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleToggleLike() {
    try {
      if (!user) {
        return alert("Log in to Like and Comment");
      }

      if (Object.keys(commentState.isLiked).length !== 0) {
        setCommentState({
          comment: commentState.comment,
          isLiked: commentState.isLiked,
          isUpdating: commentState.isUpdating,
          isLoading: true,
        });
        return await deleteLike();
      } else {
        setCommentState({
          comment: commentState.comment,
          isLiked: commentState.isLiked,
          isUpdating: commentState.isUpdating,
          isLoading: true,
        });
        await addLike();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function toggleIsUpdating() {
    setDropdownStatus(false);
    setCommentState({
      comment: commentState.comment,
      isLiked: commentState.isLiked,
      isUpdating: true,
      isLoading: false,
    });
  }

  async function updatePost(e) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = new URLSearchParams(formData);

      const res = await fetch(
        `${serverRoot}/api/posts/${post._id}/comments/${commentState.comment._id}`,
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

      const updatedComment = commentState.comment;
      updatedComment.content = updatedCommentContent.current.value;

      return setCommentState({
        comment: updatedComment,
        isLiked: commentState.isLiked,
        isUpdating: false,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment() {
    try {
      const res = await fetch(
        `${serverRoot}/api/posts/${post._id}/comments/${commentState.comment._id}`,
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
          `${serverRoot}/api/comments/${commentState.comment._id}/likes`,
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

        return setCommentState({
          comment: commentState.comment,
          isLiked: resData.commentLike,
          isUpdating: commentState.isUpdating,
          isLoading: commentState.isUpdating,
        });
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserLike().catch((err) => {
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

  if (isDeleted) {
    return null;
  }

  return (
    <div className="commentWrapper">
      {comment.author.profilePic ? (
        <img
          src={`${serverRoot}/images/${comment.author.profilePic}`}
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
            <Link to={`${clientRoot}/users/${commentState.comment.author._id}`}>
              <div className="commentUsername">{`${commentState.comment.author.firstName} ${commentState.comment.author.lastName}`}</div>
            </Link>
            {user && user.user._id === commentState.comment.author._id && (
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
          {commentState.isUpdating ? (
            <form className="updateFormContainer" onSubmit={updatePost}>
              <textarea
                name="content"
                className="commentUpdateTextarea"
                ref={updatedCommentContent}
                defaultValue={commentState.comment.content}
                autoFocus={true}
                required={true}
              ></textarea>
              <div className="updateFormButtonContainer">
                <button className="updateFormButton">Update</button>
              </div>
            </form>
          ) : (
            <div className="commentRightContent">
              {parse(commentState.comment.content.replace(/\n\r?/g, "<br />"))}
            </div>
          )}
        </div>
        <div className="commentLikeAndReplies">
          {Object.keys(commentState.isLiked).length !== 0 ? (
            <span
              className="commentLike commentLiked"
              onClick={handleToggleLike}
            >
              Like({commentState.comment.numLikes})
            </span>
          ) : (
            <span className="commentLike" onClick={handleToggleLike}>
              Like({commentState.comment.numLikes})
            </span>
          )}
          <span className="commentDate">
            {<ReactTimeAgo date={new Date(commentState.comment.createdAt)} />}
          </span>
        </div>
      </div>
    </div>
  );
}
