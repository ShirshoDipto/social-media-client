import "./posts.css";
import Post from "../post/Post";

export default function Posts({ posts }) {
  const allPosts = posts.map((post) => {
    return <Post key={post.id} post={post} />;
  });

  return <div className="postsContainer">{allPosts}</div>;
}
