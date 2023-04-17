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
    const text = await content.current.value.replace(/\n\r?/g, "<br />");

    try {
      const res = await fetch(`${serverRoot}/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) {
        console.log(await res.json());
      }

      const resData = await res.json();

      e.target.reset();
      addNewComment(resData.comment);
      setNumComments(resData.numComments);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="commentInput">
      <div className="commentInputWrapper">
        {user && user.user.profilePic ? (
          <img
            src={`${serverRoot}/images/${user.user.profilePic}`}
            alt=""
            className="commentInputUserImg"
          />
        ) : (
          <img
            src={`${clientRoot}/assets/person/noAvatar.png`}
            alt=""
            className="commentInputUserImg"
          />
        )}
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
