import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Topbar({ user }) {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();

  function handleLogout() {
    localStorage.removeItem("nosebookUser");
    window.location.reload();
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdown.current && !dropdown.current.contains(e.target)) {
        setDropdownStatus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" className="routerLink">
          <span className="topbarLogo">NoseBook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input
            type="text"
            placeholder="Search for People"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        {user ? (
          <div className="topbarRightWrapper">
            <div className="topbarLinks">
              <span className="topbarLink">Homepage</span>
              <span className="topbarLink">Timeline</span>
            </div>
            <div className="topbarIcons">
              <div className="topbarIconItem">
                <PersonIcon />
                <span className="topbarIconBadge">1</span>
              </div>
              <div className="topbarIconItem">
                <ChatIcon />
                <span className="topbarIconBadge">2</span>
              </div>
              <div className="topbarIconItem">
                <NotificationsIcon />
                <span className="topbarIconBadge">1</span>
              </div>
            </div>
            <div className="topbarDropdownContainer">
              <img
                src="/assets/person/shusme.jpg"
                alt=""
                className="topbarImg"
                onClick={() => setDropdownStatus(!dropdownStatus)}
              />

              {dropdownStatus && (
                <ul className="topbarDropdown" ref={dropdown}>
                  <Link to={`users/${user.user._id}`} className="routerLink">
                    <li className="topbarDropdownProfile">
                      <img
                        src="/assets/person/shusme.jpg"
                        alt=""
                        className="topbarImg"
                      />
                      <span className="dropdownProfileName">{`${user.user.firstName} ${user.user.lastName}`}</span>
                    </li>
                  </Link>
                  <hr className="dropdownHr" />
                  <li className="topbarDropdownLogout" onClick={handleLogout}>
                    <LogoutIcon className="logoutIcon" />
                    <span className="logoutText">Logout</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        ) : (
          <ul className="topbarRightList">
            <li className="topbarRightListItem">
              <Link to={"/login"} className="routerLink">
                <span className="topbarRightLogin">Log In</span>
              </Link>
            </li>
            <li className="topbarRightListItem">
              <Link to={"/signup"}>
                <button className="topbarRightSignup">Sign Up</button>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
