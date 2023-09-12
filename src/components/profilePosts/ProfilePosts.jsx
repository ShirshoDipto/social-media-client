import "./profilePosts.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../post/Post";
import { useInView } from "react-intersection-observer";

export default function ProfilePosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoMorePosts, setHasNoMorePosts] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const params = useParams();
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function fetchUserPosts() {
    try {
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/posts?skip=${posts.length}`
      );

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      if (resData.posts.length < 10) {
        setHasNoMorePosts(true);
      }

      setPosts([...posts, ...resData.posts]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserPosts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isLoading && !hasNoMorePosts && inView) {
      setIsLoading(true);
      fetchUserPosts();
    }
    // eslint-disable-next-line
  }, [inView]);

  return (
    <div className="profilePosts">
      <div className="profilePostsWrapper">
        <div className="profilePostsTitle">Posts</div>
        {posts.length > 0 && (
          <div className="allPosts">
            {posts.map((post) => {
              return (
                <Post
                  key={post._id}
                  user={user}
                  post={post}
                  posts={posts}
                  setPosts={setPosts}
                />
              );
            })}
          </div>
        )}
        {isLoading ? (
          <CircularProgress className="postsLoading" disableShrink />
        ) : (
          hasNoMorePosts &&
          (posts.length === 0 ? (
            <span className="noMorePoststext">No posts available. </span>
          ) : (
            <span className="noMorePoststext">No more posts available.</span>
          ))
        )}
      </div>
      <div style={{ height: "1px" }} ref={ref}></div>
    </div>
  );
}
