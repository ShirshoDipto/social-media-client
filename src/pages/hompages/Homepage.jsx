import "./homepage.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Homepage() {
  return (
    <div>
      <Topbar />
      <div className="homepageContainer">
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </div>
  );
}
