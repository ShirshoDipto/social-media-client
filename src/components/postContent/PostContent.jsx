import "./postContent.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { useEffect, useState } from "react";

export default function PostContent({ user, post }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  const [postState, setPostState] = useState({
    post: post,
    isLiked: {},
    isUpdating: false,
    isLoading: false,
  });

  async function addLike() {
    if (postState.isLoading) {
      return;
    }

    const res = await fetch(
      `${serverRoot}/api/posts/${postState.post._id}/likes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!res.ok) {
      return console.log(await res.json());
    }

    const resData = await res.json();
    let newPost = postState.post;
    newPost.numLikes += 1;
    return setPostState({
      post: newPost,
      isLiked: resData.postLike,
      isUpdating: postState.isUpdating,
      isLoading: false,
    });
  }

  async function deleteLike() {
    if (postState.isLoading) {
      return;
    }

    const res = await fetch(
      `${serverRoot}/api/posts/${postState.post._id}/likes/${postState.isLiked._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!res.ok) {
      return console.log(await res.json());
    }

    let newPost = postState.post;
    newPost.numLikes -= 1;
    return setPostState({
      post: newPost,
      isLiked: {},
      isUpdating: postState.isUpdating,
      isLoading: postState.isLoading,
    });
  }

  async function handleToggleLike() {
    if (!user) {
      return alert("Log in to Like and Comment");
    }

    if (Object.keys(postState.isLiked).length !== 0) {
      setPostState({
        post: postState.post,
        isLiked: postState.isLiked,
        isUpdating: postState.isUpdating,
        isLoading: true,
      });
      return await deleteLike();
    } else {
      setPostState({
        post: postState.post,
        isLiked: postState.isLiked,
        isUpdating: postState.isUpdating,
        isLoading: true,
      });
      await addLike();
    }
  }

  useEffect(() => {
    async function fetchUserLike() {
      if (!user) {
        return;
      }

      const res = await fetch(`${serverRoot}/api/posts/${post._id}/likes`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        console.log(await res.json());
      }

      const resData = await res.json();

      if (resData.error) {
        return;
      }

      return setPostState({
        post: postState.post,
        isLiked: resData.postLike,
        isUpdating: postState.isUpdating,
        isLoading: postState.isUpdating,
      });
    }

    fetchUserLike().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className="postWrapper">
      <div className="postTop">
        <div className="postTopLeft">
          <img
            src="/assets/person/shusme.jpg"
            alt=""
            className="postProfileImg"
          />
          <div className="postUserAndDate">
            <Link
              to={`users/${postState.post.author._id}`}
              className="routerLink"
            >
              <span className="postUsername">{`${postState.post.author.firstName} ${postState.post.author.lastName}`}</span>
            </Link>
            <span className="postDate">
              <ReactTimeAgo
                date={new Date(postState.post.createdAt)}
                locale="en-US"
              />
            </span>
          </div>
        </div>
        <div className="postTopRight">
          <MoreVertIcon className="moreVert" />
        </div>
      </div>
      <div className="postCenter">
        <span className="postText">{postState.post.content}</span>
        <img src={postState.post.photo} alt="" className="postImg" />
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <img src="/assets/like.png" alt="" className="likeIcon" />
          <img src="/assets/heart.png" alt="" className="likeIcon" />
          <span className="postLikeCounter">
            {postState.post.numLikes} people like it
          </span>
        </div>
        <div className="postBottomRight">
          <div className="postCommentText">
            {postState.post.numComments} comments
          </div>
        </div>
      </div>
      <div className="likeAndCommentContainer">
        {Object.keys(postState.isLiked).length !== 0 ? (
          <div className="postLike" onClick={handleToggleLike}>
            <ThumbUpOffAltIcon className="postLikeCommentIcon postLiked" />
            <span className="postLikeCommentText postLiked">Like</span>
          </div>
        ) : (
          <div className="postLike" onClick={handleToggleLike}>
            <ThumbUpOffAltIcon className="postLikeCommentIcon" />
            <span className="postLikeCommentText">Like</span>
          </div>
        )}
        <div className="postComment">
          <ModeCommentOutlinedIcon className="postLikeCommentIcon" />
          <span className="postLikeCommentText">Comment</span>
        </div>
      </div>
    </div>
  );
}
