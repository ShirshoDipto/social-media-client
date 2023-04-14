import "./postInput.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

export default function PostInput({ user }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const [image, setImage] = useState(null);
  const imgRef = useRef();
  const content = useRef();

  async function handlePostSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    if (image) {
      const fileName = uuidv4();
      formData.append("imageName", fileName + image.name);
      formData.append("image", image);
    }
    const text = await content.current.value.replace(/\n\r?/g, "<br />");
    formData.append("content", text);
    try {
      const res = await fetch(`${serverRoot}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        console.log(await res.json());
      }

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRemoveImg() {
    setImage(null);
    imgRef.current.value = "";
  }

  return (
    <div className="postInput">
      <form className="postInputWrapper" onSubmit={handlePostSubmit}>
        <div className="postInputTop">
          <img
            className="postInputProfileImg"
            src="/assets/person/2.jpeg"
            alt=""
          />
          <textarea
            ref={content}
            placeholder="What's in your mind?"
            className="postInputWriteArea"
            rows={5}
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
          <button className="postInputButton">Post</button>
        </div>
      </form>
    </div>
  );
}
