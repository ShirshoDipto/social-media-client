import "./comment.css";
import CommentContent from "../commentContent/CommentContent";
import ReplyContainer from "../replyContainer/ReplyContainer";

export default function Comment({ comment }) {
  return (
    <div className="comment">
      <CommentContent comment={comment} />
      {/* <ReplyContainer /> */}
    </div>
  );
}
