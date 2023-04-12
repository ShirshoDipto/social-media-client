import "./post.css";
import PostContent from "../postContent/PostContent";
import CommentContainer from "../commentContainer/CommentContainer";

export default function Post({ post }) {
  return (
    <div className="post">
      <PostContent post={post} />
      <CommentContainer />
    </div>
  );
}
