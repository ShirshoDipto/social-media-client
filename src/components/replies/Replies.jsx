import "./replies.css";
import Reply from "../reply/Reply";

export default function Replies({ replies }) {
  const allReplies = replies.map((reply) => {
    return <Reply key={reply.id} reply={reply} />;
  });

  return <div className="allReplies">{allReplies}</div>;
}
