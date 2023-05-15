import "./profilePosts.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "../posts/Posts";

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
    async function onScroll() {
      const scrollTop = document.documentElement.scrollTop;
      const offsetHeight = document.documentElement.offsetHeight;
      const innerHeight = window.innerHeight;

      if (scrollTop + innerHeight + 1 >= offsetHeight) {
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
        <Posts user={user} posts={posts} setPosts={setPosts} />
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
