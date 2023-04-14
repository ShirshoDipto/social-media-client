import "./postContent.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import { Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

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
            <Link to={`users/${post.author._id}`} className="routerLink">
              <span className="postUsername">{`${post.author.firstName} ${post.author.lastName}`}</span>
            </Link>
            <span className="postDate">
              <ReactTimeAgo date={post.createdAt} locale="en-US" />
            </span>
          </div>
        </div>
        <div className="postTopRight">
          <MoreVertIcon className="moreVert" />
        </div>
      </div>
      <div className="postCenter">
        <span className="postText">{post.content}</span>
        <img src={post.photo} alt="" className="postImg" />
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <img src="/assets/like.png" alt="" className="likeIcon" />
          <img src="/assets/heart.png" alt="" className="likeIcon" />
          <span className="postLikeCounter">
            {post.numLikes} people like it
          </span>
        </div>
        <div className="postBottomRight">
          <div className="postCommentText">{post.numComments} comments</div>
        </div>
      </div>
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
