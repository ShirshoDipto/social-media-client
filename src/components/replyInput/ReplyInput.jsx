import "./replyInput.css";

export default function ReplyInput() {
  return (
    <div className="replyInput">
      <div className="replyInputWrapper">
        <img
          src="/assets/person/shusme.jpg"
          alt=""
          className="replyInputUserImg"
        />
        <form className="replyInputForm">
          <textarea
            className="replyInputTextarea"
            name="replyCoontent"
            placeholder="Write a reply"
          ></textarea>
          <div className="replyInputButtonContainer">
            <button className="replyInputSubmit" type="submit">
              Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
