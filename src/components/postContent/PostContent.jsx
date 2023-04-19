import "./postContent.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";

export default function PostContent({
  user,
  post,
  handleToggleComments,
  numComments,
  deletePost,
}) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const updatedPostContent = useRef();

  const [postState, setPostState] = useState({
    post: post,
    isLiked: {},
    isUpdating: false,
    isLoading: false,
  });

  async function addLike() {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteLike() {
    try {
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
    } catch (error) {
      console.log(error);
    }
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
      await deleteLike();
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

  async function toggleIsUpdating() {
    setDropdownStatus(false);
    setPostState({
      post: postState.post,
      isLiked: postState.isLiked,
      isUpdating: true,
      isLoading: false,
    });
  }

  async function updatePost(e) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = new URLSearchParams(formData);

      const res = await fetch(`${serverRoot}/api/posts/${postState.post._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: data,
      });

      if (!res.ok) {
        console.log(await res.json());
      }

      const updatedPost = postState.post;
      updatedPost.content = updatedPostContent.current.value;

      return setPostState({
        post: updatedPost,
        isLiked: postState.isLiked,
        isUpdating: false,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        !dropdownTrigger.current.contains(e.target)
      ) {
        setDropdownStatus(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="postWrapper">
      <div className="postTop">
        <div className="postTopLeft">
          {postState.post.author.profilePic ? (
            <img
              src={`${serverRoot}/images/${postState.post.author.profilePic}`}
              alt=""
              className="postProfileImg"
            />
          ) : (
            <img
              src={`${clientRoot}/assets/person/noAvatar.png`}
              alt=""
              className="postProfileImg"
            />
          )}
          <div className="postUserAndDate">
            <Link
              to={`${clientRoot}/users/${postState.post.author._id}`}
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
          {user && user.user._id === postState.post.author._id && (
            <div className="postDropdownContainer">
              <div
                className="moreVertContainer"
                ref={dropdownTrigger}
                onClick={() => setDropdownStatus(!dropdownStatus)}
              >
                <MoreVertIcon className="moreVert" />
              </div>
              {dropdownStatus && (
                <ul className="postDropdown" ref={dropdown}>
                  <li className="postDropdownItem" onClick={toggleIsUpdating}>
                    <EditIcon className="postDropdownIcon" />
                    <span className="postDropdownItemText">Update</span>
                  </li>
                  <li className="postDropdownItem" onClick={deletePost}>
                    <DeleteIcon className="postDropdownIcon" />
                    <span className="postDropdownItemText">Delete</span>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="postCenter">
        {postState.isUpdating ? (
          <form className="updateFormContainer" onSubmit={updatePost}>
            <textarea
              name="content"
              className="postUpdateTextarea"
              ref={updatedPostContent}
              defaultValue={postState.post.content}
              autoFocus={true}
              required={true}
            ></textarea>
            <div className="updateFormButtonContainer">
              <button className="updateFormButton">Update</button>
            </div>
          </form>
        ) : (
          <div className="postText">
            {parse(postState.post.content.replace(/\n\r?/g, "<br />"))}
          </div>
        )}
        {postState.post.image && (
          <img
            src={`${serverRoot}/images/${postState.post.image}`}
            alt=""
            className="postImg"
          />
        )}
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
          <div className="postCommentText">{numComments} comments</div>
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
        <div className="postComment" onClick={handleToggleComments}>
          <ModeCommentOutlinedIcon className="postLikeCommentIcon" />
          <span className="postLikeCommentText">Comment</span>
        </div>
      </div>
    </div>
  );
}
