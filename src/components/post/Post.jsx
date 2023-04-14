import "./post.css";
import PostContent from "../postContent/PostContent";
import CommentContainer from "../commentContainer/CommentContainer";
import { useState } from "react";

export default function Post({ user, post }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isComments, setIsComments] = useState(false);

  async function handleToggleComments() {
    if (isComments) {
      return setIsComments(false);
    }
    return setIsComments(true);
  }

  return (
    <div className="post">
      <PostContent
        user={user}
        post={post}
        handleToggleComments={handleToggleComments}
      />
      {isComments && <CommentContainer user={user} post={post} />}
    </div>
  );
}
