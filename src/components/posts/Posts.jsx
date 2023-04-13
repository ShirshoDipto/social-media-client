import "./posts.css";
import Post from "../post/Post";

export default function Posts({ posts }) {
  const allPosts = posts.map((post) => {
    return <Post key={post._id} post={post} />;
  });

  if (posts.length === 0) {
    return (
      <div className="allPosts">
        <span className="noPostsText">No posts available.</span>
      </div>
    );
  }

  return <div className="allPosts">{allPosts}</div>;
}
