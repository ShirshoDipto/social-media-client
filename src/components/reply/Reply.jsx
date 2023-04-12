import "./reply.css";
import ReplyContent from "../replyContent/ReplyContent";

export default function Reply({ reply }) {
  return (
    <div className="reply">
      <ReplyContent reply={reply} />
    </div>
  );
}
