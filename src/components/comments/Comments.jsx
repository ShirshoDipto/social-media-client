import "./comments.css";
import Comment from "../comment/Comment";

export default function Comments({ user, comments }) {
  const allComments = comments.map((comment) => {
    return <Comment key={comment._id} user={user} comment={comment} />;
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
