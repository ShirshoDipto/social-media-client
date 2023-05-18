import "./commentContainer.css";
import CommentInput from "../commentInput/CommentInput";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CommentContent from "../commentContent/CommentContent";

export default function CommentContainer({ user, post, setNumComments }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function addNewComment(newComment) {
    newComment.author = {
      _id: newComment.author,
      firstName: user.userInfo.firstName,
      lastName: user.userInfo.lastName,
      profilePic: user.userInfo.profilePic,
    };

    setComments([newComment, ...comments]);
    setIsLoading(false);
  }

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          `${serverRoot}/api/home/posts/${post._id}/comments`
        );

        const resData = await res.json();
        if (!res.ok) {
          return setIsLoading(false);
        }

        if (resData.length !== 0) {
          setComments(resData.comments);
          setIsLoading(false);
          return;
        }

        setComments(resData.comments);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

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
        <CircularProgress
          size={25}
          className="postCommentsLoading"
          disableShrink
        />
      ) : (
        <div className="allComments">
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
        </div>
      )}
    </div>
  );
}
