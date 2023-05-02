import "./post.css";
import PostContent from "../postContent/PostContent";
import CommentContainer from "../commentContainer/CommentContainer";
import { useState } from "react";

export default function Post({ user, post, posts, setPosts }) {
  const [isComments, setIsComments] = useState(false);
  const [numComments, setNumComments] = useState(post.numComments);

  async function handleToggleComments() {
    return setIsComments(!isComments);
  }

  return (
    <div className="post">
      <PostContent
        user={user}
        post={post}
        handleToggleComments={handleToggleComments}
        numComments={numComments}
        posts={posts}
        setPosts={setPosts}
      />
      {isComments && (
        <CommentContainer
          user={user}
          post={post}
          setNumComments={setNumComments}
        />
      )}
    </div>
  );
}
