import "./profilePosts.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../post/Post";

export default function ProfilePosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoMorePosts, setHasNoMorePosts] = useState(false);

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
    function onScroll() {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight + 1 >= scrollHeight) {
        if (!hasNoMorePosts) {
          setIsLoading(true);
          fetchUserPosts();
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line
  }, [posts]);

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
    </div>
  );
}
