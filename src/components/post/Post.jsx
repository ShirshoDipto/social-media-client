import "./post.css";
import PostContent from "../postContent/PostContent";
import CommentContainer from "../commentContainer/CommentContainer";
import { useState } from "react";

export default function Post({ user, post }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isComments, setIsComments] = useState(false);
  const [numComments, setNumComments] = useState(post.numComments);

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function handleToggleComments() {
    return setIsComments(!isComments);
  }

  async function deletePost() {
    try {
      const res = await fetch(`${serverRoot}/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        console.log(await res.json());
      }

      return setIsDeleted(true);
    } catch (err) {
      console.log(err);
    }
  }

  if (isDeleted) {
    return null;
  }

  return (
    <div className="post">
      <PostContent
        user={user}
        post={post}
        handleToggleComments={handleToggleComments}
        numComments={numComments}
        deletePost={deletePost}
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
