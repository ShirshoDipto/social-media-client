import "./commentContainer.css";
import CommentInput from "../commentInput/CommentInput";
import Comments from "../comments/Comments";
import { comments } from "../../dummyData";

export default function CommentContainer() {
  return (
    <div className="commentContainer">
      <CommentInput />
      <Comments comments={comments} />
    </div>
  );
}
