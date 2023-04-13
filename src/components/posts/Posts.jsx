import "./posts.css";
import Post from "../post/Post";

export default function Posts({ posts }) {
  const allPosts = posts.map((post) => {
    return <Post key={post._id} post={post} />;
  });

  console.log(posts);

  if (posts.length === 0) {
    return (
      <div className="allPosts">
        <span className="noPostsText">
          This user hasn't uploaded any post yet.
        </span>
      </div>
    );
  }

  return <div className="allPosts">{allPosts}</div>;
}
