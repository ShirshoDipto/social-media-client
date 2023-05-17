import "./homepage.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Contacts from "../../components/contacts/Contacts";

export default function Homepage({ user }) {
  return (
    <div className="homepageContainer">
      <Sidebar />
      <Feed user={user} />
      <Contacts user={user} />
    </div>
  );
}
