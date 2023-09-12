import PostInput from "../postInput/PostInput";
import CircularProgress from "@mui/material/CircularProgress";
import "./feed.css";
import { useEffect, useRef, useState } from "react";
import Post from "../post/Post";

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMorePostsLoading, setIsMorePostsLoading] = useState(false);
  const [hasNoMorePosts, setHasNoMorePosts] = useState(false);
  const morePostsTrigger = useRef();

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function fetchPosts() {
    try {
      let uri = `${serverRoot}/api/home/posts/timeline?skip=${posts.length}`;
      if (!user) {
        uri = `${serverRoot}/api/home/posts?skip=${posts.length}`;
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
      setIsInitialLoading(false);
      setIsMorePostsLoading(false);
      if (resData.posts.length < 10) {
        setHasNoMorePosts(true);
      }
    } catch (error) {
      setIsInitialLoading(false);
      setIsMorePostsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("google");
    if (!userId) {
      fetchPosts();
    }
    // eslint-disable-next-line
  }, [user]);

  // useEffect(() => {
  //   if (!isInitialLoading && !hasNoMorePosts && !isMorePostsLoading && inView) {
  //     setIsMorePostsLoading(true);
  //     fetchPosts();
  //   }
  //   // eslint-disable-next-line
  // }, [inView]);

  useEffect(() => {
    const content = morePostsTrigger.current;
    function handleMorePostsLoading(entries) {
      if (entries[0].isIntersecting && !isMorePostsLoading && !hasNoMorePosts) {
        setIsMorePostsLoading(true);
        fetchPosts();
      }
    }

    const observer = new IntersectionObserver(handleMorePostsLoading);
    if (content) observer.observe(content);

    return () => {
      if (content) observer.unobserve(content);
    };
    // eslint-disable-next-line
  }, [isMorePostsLoading, hasNoMorePosts]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {isInitialLoading && (
          <div className="homeLoadingFixed">
            <CircularProgress className="loadingFixed" disableShrink />
          </div>
        )}
        <PostInput user={user} posts={posts} setPosts={setPosts} />
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
        {isMorePostsLoading ? (
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
      <div style={{ height: "1px" }} ref={morePostsTrigger}></div>
    </div>
  );
}
