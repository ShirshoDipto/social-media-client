import "./posts.css";
import Post from "../post/Post";

export default function Posts({ user, posts, setPosts }) {
  const allPosts = posts.map((post) => {
    return (
      <Post
        key={post._id}
        user={user}
        post={post}
        posts={posts}
        setPosts={setPosts}
      />
    );
  });

  if (posts.length === 0) {
    return null;
  }

  return <div className="allPosts">{allPosts}</div>;
}
