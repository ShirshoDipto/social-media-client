import "./postContent.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";

export default function PostContent({ post }) {
  return (
    <div className="postWrapper">
      <div className="postTop">
        <div className="postTopLeft">
          <img
            src="/assets/person/shusme.jpg"
            alt=""
            className="postProfileImg"
          />
          <div className="postUserAndDate">
            <span className="postUsername">{post.user}</span>
            <span className="postDate">{post.date}</span>
          </div>
        </div>
        <div className="postTopRight">
          <MoreVertIcon className="moreVert" />
        </div>
      </div>
      <div className="postCenter">
        <span className="postText">{post.desc && post.desc}</span>
        <img src={post.photo} alt="" className="postImg" />
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <img src="/assets/like.png" alt="" className="likeIcon" />
          <img src="/assets/heart.png" alt="" className="likeIcon" />
          <span className="postLikeCounter">{post.like} people like it</span>
        </div>
        <div className="postBottomRight">
          <div className="postCommentText">{post.comment} comments</div>
        </div>
      </div>
      {/* <hr className="postHoriLine" /> */}
      <div className="likeAndCommentContainer">
        <div className="postLike">
          <ThumbUpOffAltIcon className="postLikeCommentIcon" />
          <span className="postLikeCommentText">Like</span>
        </div>
        <div className="postComment">
          <ModeCommentOutlinedIcon className="postLikeCommentIcon" />
          <span className="postLikeCommentText">Comment</span>
        </div>
      </div>
    </div>
  );
}
