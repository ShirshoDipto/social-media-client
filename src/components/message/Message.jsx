import "./message.css";

export default function Message({ own }) {
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  return (
    <div className="message">
      {!own && (
        <img
          className="messageImg"
          src={`${clientRoot}/assets/person/shusme.jpg`}
          alt=""
        />
      )}
      <div className={own ? "messageDetails own" : "messageDetails"}>
        <span className="senderDetail">Shusme, 1 min ago</span>
        <p className={own ? "messageText own" : "messageText"}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos
          praesentium perspiciatis fuga sint, dolorum laboriosam provident
          commodi ex repellat dicta, odit fugit et. Est repellat eligendi soluta
          totam, sunt distinctio.
        </p>
      </div>
    </div>
  );
}
