import "./commentContent.css";
import ReactTimeAgo from "react-time-ago";
import { useEffect, useState } from "react";
import parse from "html-react-parser";

export default function CommentContent({ user, comment, handleToggleLike }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  const [commentState, setcommentState] = useState({
    comment: comment,
    isLiked: {},
    isUpdating: false,
    isLoading: false,
  });

  async function addLike() {
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
    return setcommentState({
      comment: newcomment,
      isLiked: resData.commentLike,
      isUpdating: commentState.isUpdating,
      isLoading: false,
    });
  }

  async function deleteLike() {
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
    return setcommentState({
      comment: newcomment,
      isLiked: {},
      isUpdating: commentState.isUpdating,
      isLoading: commentState.isLoading,
    });
  }

  async function handleToggleLike() {
    if (!user) {
      return alert("Log in to Like and Comment");
    }

    if (Object.keys(commentState.isLiked).length !== 0) {
      setcommentState({
        comment: commentState.comment,
        isLiked: commentState.isLiked,
        isUpdating: commentState.isUpdating,
        isLoading: true,
      });
      return await deleteLike();
    } else {
      setcommentState({
        comment: commentState.comment,
        isLiked: commentState.isLiked,
        isUpdating: commentState.isUpdating,
        isLoading: true,
      });
      await addLike();
    }
  }

  useEffect(() => {
    async function fetchUserLike() {
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
        console.log(await res.json());
      }

      const resData = await res.json();

      if (resData.error) {
        return;
      }

      return setcommentState({
        comment: commentState.comment,
        isLiked: resData.commentLike,
        isUpdating: commentState.isUpdating,
        isLoading: commentState.isUpdating,
      });
    }

    fetchUserLike().catch((err) => {
      console.log(err);
    });
  }, []);

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
          <div className="commentUserAndDate">
            <div className="commentUsername">{`${commentState.comment.author.firstName} ${commentState.comment.author.lastName}`}</div>
          </div>
          <div className="commentRightContent">
            {parse(commentState.comment.content)}
          </div>
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
