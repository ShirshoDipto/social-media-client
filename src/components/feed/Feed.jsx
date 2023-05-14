import PostInput from "../postInput/PostInput";
import Posts from "../posts/Posts";
import CircularProgress from "@mui/material/CircularProgress";
import "./feed.css";
import { useEffect, useState } from "react";

export default function Feed({ user }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoMorePosts, setHasNoMorePosts] = useState(false);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      let uri = `${serverRoot}/api/posts/timeline?skip=${posts.length}`;
      if (!user) {
        uri = `${serverRoot}/api/posts?skip=${posts.length}`;
      }

      const res = await fetch(uri, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      setPosts([...posts, ...resData.posts]);
      setIsLoading(false);
      if (resData.posts.length < 10) {
        setHasNoMorePosts(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPosts().catch((err) => {
      console.log(err);
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    function onScroll() {
      const scrollTop = document.documentElement.scrollTop;
      const offsetHeight = document.documentElement.offsetHeight;
      const innerHeight = window.innerHeight;

      if (scrollTop + innerHeight + 1 >= offsetHeight) {
        if (!hasNoMorePosts) {
          fetchPosts();
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line
  }, [posts]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <PostInput user={user} posts={posts} setPosts={setPosts} />
        <Posts user={user} posts={posts} setPosts={setPosts} />
        {isLoading ? (
          <CircularProgress className="homePostsLoading" disableShrink />
        ) : (
          hasNoMorePosts &&
          (posts.length === 0 ? (
            <span className="noMorePoststext">No posts available. </span>
          ) : (
            <span className="noMorePoststext">No more posts available. </span>
          ))
        )}
      </div>
    </div>
  );
}
