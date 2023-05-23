import "./postInput.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";
import { socket } from "../../socket";
import ErrorComponent from "../ErrorComponent";

export default function PostInput({ user, posts, setPosts }) {
  const [image, setImage] = useState(null);
  const imgRef = useRef();
  const content = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    msg: "",
    open: false,
  });

  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  async function addPostAndSendEvent(newPost) {
    newPost.author = {
      _id: user.userInfo._id,
      firstName: user.userInfo.firstName,
      lastName: user.userInfo.lastName,
      profilePic: user.userInfo.profilePic,
    };

    newPost.isNew = true;

    setPosts([newPost, ...posts]);
    socket.emit("sendPost", user.userInfo._id);
  }

  async function handleRemoveImg() {
    setImage(null);
    imgRef.current.value = "";
  }

  async function handleErrorClose() {
    const newError = { ...error };
    newError.open = false;
    setError(newError);
  }

  async function handleErrorMsg(err) {
    const newError = { ...error };
    newError.open = true;
    if (err.error === "File too large") {
      newError.msg = "File has to be less than 5 MB";
    } else if (err.errors) {
      newError.msg = err.errors[0].msg;
    } else {
      newError.msg = err.error;
    }
    setError(newError);
  }

  async function handlePostSubmit(e) {
    const formData = new FormData();

    if (image) {
      formData.append("imageName", uuidv4());
      formData.append("image", image);
    }

    formData.append("content", content.current.value);

    try {
      const res = await fetch(`${serverRoot}/api/home/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        throw resData;
      }

      await addPostAndSendEvent(resData.post);
      setIsLoading(false);
      e.target.reset();
      await handleRemoveImg();
    } catch (err) {
      handleErrorMsg(err);
    }
  }

  return (
    <div className="postInput">
      <ErrorComponent error={error} handleErrorClose={handleErrorClose} />
      <form
        className="postInputWrapper"
        onSubmit={(e) => {
          e.preventDefault();
          if (!user) {
            return alert("Log in to post");
          }
          setIsLoading(true);
          handlePostSubmit(e);
        }}
      >
        <div className="postInputTop">
          <img
            src={
              user && user.userInfo.profilePic
                ? user.userInfo.profilePic
                : `${clientRoot}/assets/person/noAvatar.png`
            }
            alt=""
            className="postInputProfileImg"
          />
          <textarea
            ref={content}
            placeholder="What's in your mind?"
            className="postInputWriteArea"
          ></textarea>
        </div>
        <hr className="postInputHr" />
        {image && (
          <div className="postInputImgContainer">
            <img
              src={URL.createObjectURL(image)}
              alt="post pic"
              className="postInputImg"
            />
            <CancelIcon
              color="action"
              className="postInputCancelImg"
              onClick={handleRemoveImg}
            />
          </div>
        )}
        <div className="postInputBottom">
          <div className="postInputOptions">
            <div className="postInputOption">
              <label htmlFor="fileInput" className="postInputOptionText">
                <PermMediaIcon htmlColor="tomato" className="postInputIcon" />
                <span className="postInputLabelText">Photo</span>
              </label>
              <input
                ref={imgRef}
                type="file"
                id="fileInput"
                name="imageName"
                style={{ display: "none" }}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>
          {isLoading && image && (
            <div className="loadingText">
              Please wait. Image upload will take some time.
            </div>
          )}
          <button className="postInputButton">
            {isLoading ? (
              <CircularProgress
                sx={{ color: grey[500] }}
                size={15}
                className="postSubmitLoading"
                disableShrink
              />
            ) : (
              <span>Post</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
