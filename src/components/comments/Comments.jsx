import "./comments.css";
import Comment from "../comment/Comment";

export default function Comments({ comments }) {
  const allComments = comments.map((comment) => {
    return <Comment key={comment.id} comment={comment} />;
  });

  return <div className="allComments">{allComments}</div>;
}
