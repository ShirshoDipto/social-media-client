import "./comments.css";
import CommentContent from "../commentContent/CommentContent";

export default function Comments({ user, post, comments, setNumComments }) {
  const allComments = comments.map((comment) => {
    return (
      <CommentContent
        key={comment._id}
        user={user}
        post={post}
        comment={comment}
        setNumComments={setNumComments}
      />
    );
  });

  if (comments.length === 0) {
    return (
      <div className="allComments">
        <span className="noCommentsText">No comments available.</span>
      </div>
    );
  }

  return <div className="allComments">{allComments}</div>;
}
