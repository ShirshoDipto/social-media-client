import "./commentContainer.css";
import CommentInput from "../commentInput/CommentInput";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CommentContent from "../commentContent/CommentContent";

export default function CommentContainer({ user, post, setNumComments }) {
  const [commentsState, setCommentsState] = useState({
    comments: [],
    isLoading: true,
  });

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function addNewComment(newComment) {
    newComment.author = {
      _id: newComment.author,
      firstName: user.userInfo.firstName,
      lastName: user.userInfo.lastName,
      profilePic: user.userInfo.profilePic,
    };

    setCommentsState({
      comments: [newComment, ...commentsState.comments],
      isLoading: false,
    });
  }

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch(`${serverRoot}/api/posts/${post._id}/comments`);

      const resData = await res.json();
      if (!res.ok) {
        return setCommentsState({
          comments: commentsState.comments,
          isLoading: false,
        });
      }

      if (resData.length !== 0) {
        return setCommentsState({
          comments: resData.comments,
          isLoading: false,
        });
      }

      return setCommentsState({
        comments: resData.comments,
        isLoading: false,
      });
    }

    fetchComments().catch((err) => {
      console.log(err);
    });
    // eslint-disable-next-line
  }, [serverRoot, post._id]);

  return (
    <div className="commentContainer">
      <CommentInput
        user={user}
        post={post}
        addNewComment={addNewComment}
        setNumComments={setNumComments}
      />
      {commentsState.isLoading ? (
        <CircularProgress
          size={25}
          className="postCommentsLoading"
          disableShrink
        />
      ) : (
        <div className="allComments">
          {commentsState.comments.length > 0 ? (
            commentsState.comments.map((comment) => {
              return (
                <CommentContent
                  key={comment._id}
                  user={user}
                  post={post}
                  comment={comment}
                  setNumComments={setNumComments}
                />
              );
            })
          ) : (
            <span className="noCommentsText">No comments available.</span>
          )}
        </div>
      )}
    </div>
  );
}
