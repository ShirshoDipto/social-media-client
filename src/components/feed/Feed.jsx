import PostInput from "../postInput/PostInput";
import Posts from "../posts/Posts";
import CircularProgress from "@mui/material/CircularProgress";
import "./feed.css";
import { useEffect, useState } from "react";

export default function Feed({ user }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoMorePosts, setIsNoMorePosts] = useState(false);

  async function addNewPost(newPost) {
    newPost.author = {
      _id: user.user._id,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      profilePic: user.user.profilePic,
    };

    setPosts([newPost, ...posts]);
  }

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(
          `${serverRoot}/api/posts/timeline?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        // const res = await fetch(`${serverRoot}/api/posts?page=${page}`);

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        setPosts([...posts, ...resData.posts]);
        setIsLoading(false);
        if (resData.posts.length < 10) {
          setIsNoMorePosts(true);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (user) {
      fetchPosts().catch((err) => {
        console.log(err);
      });
    } else {
      return setIsLoading(false);
    }
  }, [page, user]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <PostInput user={user} addNewPost={addNewPost} />
        <Posts user={user} posts={posts} />
        {isLoading ? (
          <CircularProgress className="homePostsLoading" disableShrink />
        ) : isNoMorePosts ? (
          <span className="noMorePoststext">No posts available. </span>
        ) : (
          <button
            className="postLoadMore"
            onClick={() => {
              setIsLoading(true);
              setPage(page + 1);
            }}
          >
            Load more...
          </button>
        )}
      </div>
    </div>
  );
}
