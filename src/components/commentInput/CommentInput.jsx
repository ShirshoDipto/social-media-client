import "./commentInput.css";

export default function CommentInput() {
  return (
    <div className="commentInput">
      <div className="commentInputWrapper">
        <img
          src="/assets/person/shusme.jpg"
          alt=""
          className="commentInputUserImg"
        />
        <form className="commentInputForm">
          <textarea
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
