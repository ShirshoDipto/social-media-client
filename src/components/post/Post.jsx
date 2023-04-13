import "./post.css";
import PostContent from "../postContent/PostContent";
import CommentContainer from "../commentContainer/CommentContainer";
import { useState } from "react";

export default function Post({ post }) {
  const [postState, setPostState] = useState({
    post: post,
    isLiked: {},
    isUpdate: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <div className="post">
      <PostContent post={postState.post} />
      <CommentContainer />
    </div>
  );
}
