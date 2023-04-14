import "./homepage.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Homepage({ user }) {
  return (
    <div className="home">
      <Topbar user={user} />
      <div className="homepageContainer">
        <Sidebar user={user} />
        <Feed user={user} />
        <Rightbar user={user} />
      </div>
    </div>
  );
}
