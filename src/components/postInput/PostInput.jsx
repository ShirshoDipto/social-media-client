import "./postInput.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";
import { socket } from "../../socket";

export default function PostInput({ user, posts, setPosts }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const [image, setImage] = useState(null);
  const imgRef = useRef();
  const content = useRef();
  const [isLoading, setIsLoading] = useState(false);

  async function addPostAndSendEvent(newPost) {
    newPost.author = {
      _id: user.user._id,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      profilePic: user.user.profilePic,
    };

    setPosts([newPost, ...posts]);
    socket.emit("sendPost", {
      userId: user.user._id,
      post: newPost,
    });
  }

  async function handleRemoveImg() {
    setImage(null);
    imgRef.current.value = "";
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    if (!user) {
      return alert("Log in to Like and Comment");
    }
    const formData = new FormData();
    setIsLoading(true);

    if (image) {
      const fileName = uuidv4() + image.name;
      formData.append("imageName", fileName);
      formData.append("image", image);
    }

    formData.append("content", content.current.value);

    try {
      const res = await fetch(`${serverRoot}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        setIsLoading(false);
        return console.log(await res.json());
      }

      const resData = await res.json();
      await addPostAndSendEvent(resData.post);
      setIsLoading(false);
      e.target.reset();
      await handleRemoveImg();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="postInput">
      <form className="postInputWrapper" onSubmit={handlePostSubmit}>
        <div className="postInputTop">
          {user && user.user.profilePic ? (
            <img
              src={`${serverRoot}/images/${user.user.profilePic}`}
              alt=""
              className="postInputProfileImg"
            />
          ) : (
            <img
              src={`${clientRoot}/assets/person/noAvatar.png`}
              alt=""
              className="postInputProfileImg"
            />
          )}
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
