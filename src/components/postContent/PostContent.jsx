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
  posts,
  setPosts,
}) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const updatedPostContent = useRef();
  const [numLikes, setNumLikes] = useState(post.numLikes);
  const [isLiked, setIsliked] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const fullname = `${post.author.firstName} ${post.author.lastName}`;

  async function handleDeletePost() {
    try {
      const res = await fetch(`${serverRoot}/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      const newPosts = posts.filter((p) => p._id !== post._id);
      return setPosts(newPosts);
    } catch (error) {
      console.log(error);
    }
  }

  async function addLike() {
    try {
      const res = await fetch(`${serverRoot}/api/posts/${post._id}/likes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        return console.log(await res.json());
      }

      const resData = await res.json();
      setNumLikes(numLikes + 1);
      setIsliked(resData.postLike);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteLike() {
    try {
      const res = await fetch(
        `${serverRoot}/api/posts/${post._id}/likes/${isLiked._id}`,
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

      setNumLikes(numLikes - 1);
      setIsliked({});
    } catch (error) {
      console.log(error);
    }
  }

  async function handleToggleLike() {
    if (!user) {
      return alert("Log in to Like and Comment");
    }

    if (Object.keys(isLiked).length !== 0) {
      await deleteLike();
    } else {
      await addLike();
    }
  }

  async function toggleIsUpdating() {
    setDropdownStatus(false);
    setIsUpdating(true);
  }

  async function replacePost(postContent) {
    const newPosts = posts.map((p) => {
      if (post._id !== p._id) {
        return p;
      }

      const newPost = { ...post };
      newPost.content = postContent;
      return newPost;
    });
    return newPosts;
  }

  async function updatePost(e) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = new URLSearchParams(formData);

      const res = await fetch(`${serverRoot}/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: data,
      });

      if (!res.ok) {
        console.log(await res.json());
      }

      const newPosts = await replacePost(updatedPostContent.current.value);
      setPosts(newPosts);
      setIsUpdating(false);
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

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      if (resData.error) {
        return;
      }
      setIsliked(resData.postLike);
    }

    fetchUserLike().catch((err) => {
      console.log(err);
    });
  }, [post._id, serverRoot, user]);

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
          {post.author.profilePic ? (
            <img
              src={`${serverRoot}/images/${post.author.profilePic}`}
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
              to={`${clientRoot}/users/${post.author._id}`}
              className="routerLink"
            >
              <span className="postUsername">{fullname}</span>
            </Link>
            <span className="postDate">
              <ReactTimeAgo date={new Date(post.createdAt)} locale="en-US" />
            </span>
          </div>
        </div>
        <div className="postTopRight">
          {user && user.userInfo._id === post.author._id && (
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
                  <li className="postDropdownItem" onClick={handleDeletePost}>
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
        {isUpdating ? (
          <form className="updateFormContainer" onSubmit={updatePost}>
            <textarea
              name="content"
              className="postUpdateTextarea"
              ref={updatedPostContent}
              defaultValue={post.content}
              autoFocus={true}
              required={true}
            ></textarea>
            <div className="updateFormButtonContainer">
              <span
                className="postUpdateCancel"
                onClick={() => setIsUpdating(false)}
              >
                Cancel
              </span>
              <button className="updateFormButton">Update</button>
            </div>
          </form>
        ) : (
          <div className="postText">
            {parse(post.content.replace(/\n\r?/g, "<br />"))}
          </div>
        )}
        {post.image && (
          <img
            src={`${serverRoot}/images/${post.image}`}
            alt=""
            className="postImg"
          />
        )}
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <img src="/assets/like.png" alt="" className="likeIcon" />
          <img src="/assets/heart.png" alt="" className="likeIcon" />
          <span className="postLikeCounter">{numLikes} people like it</span>
        </div>
        <div className="postBottomRight">
          <div className="postCommentText">{numComments} comments</div>
        </div>
      </div>
      <div className="likeAndCommentContainer">
        {Object.keys(isLiked).length !== 0 ? (
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
