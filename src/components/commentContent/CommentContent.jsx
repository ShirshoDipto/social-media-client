import "./commentContent.css";
import ReactTimeAgo from "react-time-ago";

export default function CommentContent() {
  return (
    <div className="commentWrapper">
      <img
        src="/assets/person/profilePic.jpeg"
        alt=""
        className="commentUserImg"
      />
      <div className="commentRightContainer">
        <div className="commentUserNameAndComment">
          <div className="commentUserAndDate">
            <div className="commentUsername">Shirsho Dipto</div>
            <div className="commentDate">
              {<ReactTimeAgo date={new Date()} />}
            </div>
          </div>
          <div className="commentRightContent">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            quod quisquam sequi eos, tempora laborum, dicta deleniti assumenda
            fugit reprehenderit molestiae at accusamus cupiditate mollitia nemo
            voluptatum impedit, ullam molestias.
          </div>
        </div>
        <div className="commentLikeAndReplies">
          <span className="commentLike">Like(32)</span>
          <span className="commentReplies">Replies(7)</span>
        </div>
      </div>
    </div>
  );
}
