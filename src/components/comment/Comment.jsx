import "./comment.css";
import CommentContent from "../commentContent/CommentContent";

export default function Comment({ user, post, comment }) {
  return (
    <div className="comment">
      <CommentContent user={user} comment={comment} post={post} />
    </div>
  );
}
