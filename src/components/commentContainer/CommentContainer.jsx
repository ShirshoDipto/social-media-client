import "./commentContainer.css";
import CommentInput from "../commentInput/CommentInput";
import Comments from "../comments/Comments";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function CommentContainer({ user, post, setNumComments }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const [commentsState, setCommentsState] = useState({
    comments: [],
    isLoading: true,
  });

  async function fetchComments() {
    const res = await fetch(`${serverRoot}/api/posts/${post._id}/comments`);
    if (!res.ok) {
      console.log(await res.json());
      return setCommentsState({
        comments: commentsState.comments,
        isLoading: false,
      });
    }
    const resData = await res.json();
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

  useEffect(() => {
    fetchComments().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className="commentContainer">
      <CommentInput
        user={user}
        post={post}
        fetchComments={fetchComments}
        setNumComments={setNumComments}
      />
      {commentsState.isLoading ? (
        <CircularProgress
          size={25}
          className="postCommentsLoading"
          disableShrink
        />
      ) : (
        <Comments user={user} comments={commentsState.comments} />
      )}
    </div>
  );
}
