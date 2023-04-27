import "./conversation.css";

export default function Conversation() {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  return (
    <div className="conversation">
      <img
        src={`${clientRoot}/assets/person/shusme.jpg`}
        alt=""
        className="conversationImg"
      />
      <div className="conversationTexts">
        <div className="conversationName">Shusme Islam</div>
        <div className="conversationLatest">
          You are always korolla to me. But I still love you. And I will keep
          loving you.
        </div>
      </div>
    </div>
  );
}
