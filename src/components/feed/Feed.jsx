import PostInput from "../postInput/PostInput";
import Posts from "../posts/Posts";
import CircularProgress from "@mui/material/CircularProgress";
import "./feed.css";
import { useEffect, useState } from "react";

export default function Feed({ user }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const [postsState, setPostsState] = useState({
    posts: [],
    page: 0,
    isLoading: true,
  });

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        `${serverRoot}/api/posts?page=${postsState.page}`
      );
      if (!res.ok) {
        console.log(await res.json());
        return setPostsState({
          posts: postsState.posts,
          page: postsState.page,
          isLoading: false,
        });
      }
      const resData = await res.json();
      if (resData.length !== 0) {
        return setPostsState({
          posts: resData.posts,
          page: postsState.page + 1,
          isLoading: false,
        });
      }

      return setPostsState({
        posts: resData.posts,
        page: postsState.page,
        isLoading: false,
      });
    }

    fetchPosts().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <PostInput user={user} />
        {postsState.isLoading ? (
          <CircularProgress className="homePostsLoading" disableShrink />
        ) : (
          <Posts user={user} posts={postsState.posts} />
        )}
      </div>
    </div>
  );
}
