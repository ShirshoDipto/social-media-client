import "./postInput.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";

export default function PostInput() {
  return (
    <div className="postInput">
      <div className="postInputWrapper">
        <div className="postInputTop">
          <img
            className="postInputProfileImg"
            src="/assets/person/2.jpeg"
            alt=""
          />
          <textarea
            placeholder="What's in your mind?"
            className="postInputWriteArea"
          ></textarea>
        </div>
        <hr className="postInputHr" />
        <div className="postInputBottom">
          <div className="postInputOptions">
            <div className="postInputOption">
              <PermMediaIcon htmlColor="tomato" className="postInputIcon" />
              <span className="postInputOptionText">Photo</span>
            </div>
          </div>
          <button className="postInputButton">Post</button>
        </div>
      </div>
    </div>
  );
}
