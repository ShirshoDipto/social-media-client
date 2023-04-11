import Post from "../post/Post";
import PostInput from "../postInput/PostInput";
import Posts from "../posts/Posts";
import "./feed.css";
import { posts } from "../../dummyData";

export default function Feed() {
  return (
    <div className="feed">
      <div className="feedWrapper">
        <PostInput />
        <Posts posts={posts} />
      </div>
    </div>
  );
}
