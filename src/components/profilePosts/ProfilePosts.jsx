import "./profilePosts.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../post/Post";

export default function ProfilePosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoMorePosts, setHasNoMorePosts] = useState(false);
  const morePostsTrigger = useRef();

  const params = useParams();
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  console.log("rendered");

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
      setIsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserPosts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const content = morePostsTrigger.current;

    function handleMorePostsLoading(entries) {
      //
      if (entries[0].isIntersecting && !isLoading && !hasNoMorePosts) {
        setIsLoading(true);
        fetchUserPosts();
      }
    }

    const observer = new IntersectionObserver(handleMorePostsLoading);
    if (content) observer.observe(content);

    return () => {
      if (content) observer.unobserve(content);
    };
    // eslint-disable-next-line
  }, [isLoading, hasNoMorePosts]);

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
      <div style={{ height: "1px" }} ref={morePostsTrigger}></div>
    </div>
  );
}
