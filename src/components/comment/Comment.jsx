import "./comment.css";
import CommentContent from "../commentContent/CommentContent";
import ReplyContainer from "../replyContainer/ReplyContainer";

export default function Comment({ user, comment }) {
  return (
    <div className="comment">
      <CommentContent user={user} comment={comment} />
      {/* <ReplyContainer user={user} /> */}
    </div>
  );
}
