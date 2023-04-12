import "./replyContainer.css";
import ReplyInput from "../replyInput/ReplyInput";
import Replies from "../replies/Replies";
import { replies } from "../../dummyData";

export default function ReplyContainer() {
  return (
    <div className="replyContainer">
      <ReplyInput />
      <Replies replies={replies} />
    </div>
  );
}
