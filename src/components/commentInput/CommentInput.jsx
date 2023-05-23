import "./commentInput.css";
import { useRef } from "react";

export default function CommentInput({
  user,
  post,
  addNewComment,
  setNumComments,
}) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  const content = useRef();

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!user) {
      return alert("Log in to Like and Comment");
    }

    try {
      const res = await fetch(
        `${serverRoot}/api/home/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: content.current.value }),
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      await addNewComment(resData.comment);
      setNumComments(resData.numComments);
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="commentInput">
      <div className="commentInputWrapper">
        <img
          src={
            user && user.userInfo.profilePic
              ? user.userInfo.profilePic
              : `${clientRoot}/assets/person/noAvatar.png`
          }
          alt=""
          className="commentInputUserImg"
        />
        <form className="commentInputForm" onSubmit={handleCommentSubmit}>
          <textarea
            autoFocus={true}
            ref={content}
            className="commentInputTextarea"
            name="commentCoontent"
            placeholder="Write a comment"
          ></textarea>
          <div className="commentInputButtonContainer">
            <button className="commentInputSubmit" type="submit">
              Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
