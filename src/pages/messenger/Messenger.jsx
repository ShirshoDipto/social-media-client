import "./messenger.css";
// import Topbar from "../../components/topbar/Topbar";
import MessengerContent from "../../components/messengerContent/MessengerContent";

export default function Messenger({ user }) {
  return (
    <div className="messengerContainer">
      {/* <Topbar user={user} /> */}
      <MessengerContent user={user} />
    </div>
  );
}
