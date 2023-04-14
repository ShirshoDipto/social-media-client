import ReactTimeAgo from "react-time-ago";
import "./replyContent.css";

export default function ReplyContent() {
  return (
    <div className="replyWrapper">
      <img
        src="/assets/person/profilePic.jpeg"
        alt=""
        className="replyUserImg"
      />
      <div className="replyRightContainer">
        <div className="replyUserNameAndReply">
          <div className="replyUserAndDate">
            <div className="replyUsername">Shirsho Dipto</div>
            <div className="replyDate">
              {<ReactTimeAgo date={new Date()} />}
            </div>
          </div>
          <div className="replyRightContent">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            quod quisquam sequi eos, tempora laborum, dicta deleniti assumenda
            fugit reprehenderit molestiae at accusamus cupiditate mollitia nemo
            voluptatum impedit, ullam molestias.
          </div>
        </div>
        {/* <div className="replyLikeAndReplies">
          <span className="replyLike">Like(32)</span>
          <span className="replyReplies">Replies(7)</span>
        </div> */}
      </div>
    </div>
  );
}
