import "./homepage.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useState } from "react";

export default function Homepage({ user }) {
  const [feedOption, setFeedOption] = useState("timeline");
  return (
    <div className="home">
      <Topbar
        user={user}
        feedOption={feedOption}
        setFeedOption={setFeedOption}
      />
      <div className="homepageContainer">
        <Sidebar user={user} />
        <Feed user={user} feedOption={feedOption} />
        <Rightbar user={user} />
      </div>
    </div>
  );
}
