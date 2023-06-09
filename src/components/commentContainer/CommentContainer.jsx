import "./commentContainer.css";
import CommentInput from "../commentInput/CommentInput";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CommentContent from "../commentContent/CommentContent";

export default function CommentContainer({ user, post, setNumComments }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoMoreComments, setHasNoMoreComments] = useState(false);
  const [isMoreCommentsLoading, setIsMoreCommentsLoading] = useState(false);

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function addNewComment(newComment) {
    newComment.author = {
      _id: newComment.author,
      firstName: user.userInfo.firstName,
      lastName: user.userInfo.lastName,
      profilePic: user.userInfo.profilePic,
    };

    newComment.isNew = true;
    setComments([newComment, ...comments]);
    setIsLoading(false);
  }

  async function fetchComments() {
    try {
      const res = await fetch(
        `${serverRoot}/api/home/posts/${post._id}/comments?skip=${comments.length}`
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      setComments([...comments, ...resData.comments]);
      if (resData.comments.length < 10) {
        setHasNoMoreComments(true);
      }
      setIsLoading(false);
      setIsMoreCommentsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleScroll(e) {
    const elem = e.target;
    const scrollTop = elem.scrollTop;
    const scrollHeight = elem.scrollHeight;
    const clientHeight = elem.clientHeight;
    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      if (!hasNoMoreComments && !isMoreCommentsLoading) {
        setIsMoreCommentsLoading(true);
        fetchComments();
      }
    }
  }

  useEffect(() => {
    fetchComments();
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
      {isLoading ? (
        <div className="commentLoadingContainer">
          <CircularProgress
            size={25}
            className="postCommentsLoading"
            disableShrink
          />
        </div>
      ) : (
        <div className="allComments" onScroll={handleScroll}>
          {comments.length > 0 ? (
            comments.map((comment) => {
              return (
                <CommentContent
                  key={comment._id}
                  user={user}
                  post={post}
                  comment={comment}
                  setNumComments={setNumComments}
                  comments={comments}
                  setComments={setComments}
                />
              );
            })
          ) : (
            <span className="noCommentsText">No comments available.</span>
          )}
          {isMoreCommentsLoading && (
            <div className="commentLoadingContainer">
              <CircularProgress
                size={25}
                className="postCommentsLoading"
                disableShrink
              />
            </div>
          )}
          {hasNoMoreComments && comments.length > 10 && (
            <span className="noCommentsText">No more comments available.</span>
          )}
        </div>
      )}
    </div>
  );
}
