import "./post.css";
import PostContent from "../postContent/PostContent";
import CommentContainer from "../commentContainer/CommentContainer";
import { useState } from "react";

export default function Post({ user, post }) {
  const [isDeleted, setIsDeleted] = useState(false);
  return (
    <div className="post">
      <PostContent user={user} post={post} />
      <CommentContainer />
    </div>
  );
}
