import "./comments.css";
import Comment from "../comment/Comment";

export default function Comments({ user, comments }) {
  const allComments = comments.map((comment) => {
    return <Comment key={comment._id} user={user} comment={comment} />;
  });

  return <div className="allComments">{allComments}</div>;
}
