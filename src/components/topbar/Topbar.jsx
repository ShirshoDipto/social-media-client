import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Topbar({ user, feedOption, setFeedOption }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const home = useRef();
  const timeline = useRef();

  function handleToggleFeedOption(e) {
    if (home.current.contains(e.target) && feedOption === "home") {
      return;
    }

    if (timeline.current.contains(e.target) && feedOption === "timeline") {
      return;
    }

    if (home.current.contains(e.target) && feedOption === "timeline") {
      setFeedOption("home");
    }

    if (timeline.current.contains(e.target) && feedOption === "home") {
      setFeedOption("timeline");
    }
  }

  function handleLogout() {
    localStorage.removeItem("nosebookUser");
    window.location.reload();
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        !dropdownTrigger.current.contains(e.target)
      ) {
        setDropdownStatus(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" className="routerLink">
          <span className="topbarLogo">NoseBook</span>
        </Link>
        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input
            type="text"
            placeholder="Search for People"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarCenter">
        <div className="topbarLinks">
          <div
            ref={timeline}
            className={
              feedOption === "timeline"
                ? "topbarLinkContainer topbarLinkSelected"
                : "topbarLinkContainer"
            }
            onClick={handleToggleFeedOption}
          >
            <TimelineIcon
              sx={{ fontSize: 30 }}
              color="primary"
              className="topbarLink"
            />
          </div>
          <div
            ref={home}
            className={
              feedOption === "home"
                ? "topbarLinkContainer topbarLinkSelected"
                : "topbarLinkContainer"
            }
            onClick={handleToggleFeedOption}
          >
            <HomeIcon
              sx={{ fontSize: 30 }}
              color="primary"
              className="topbarLink"
            />
          </div>
        </div>
      </div>
      <div className="topbarRight">
        {user ? (
          <div className="topbarRightWrapper">
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
              {user.user.profilePic ? (
                <img
                  src={`${serverRoot}/images/${user.user.profilePic}`}
                  alt=""
                  className="topbarImg"
                  onClick={() => {
                    setDropdownStatus(!dropdownStatus);
                  }}
                  ref={dropdownTrigger}
                />
              ) : (
                <img
                  src={`${clientRoot}/assets/person/noAvatar.png`}
                  alt=""
                  className="topbarImg"
                  onClick={() => {
                    setDropdownStatus(!dropdownStatus);
                  }}
                  ref={dropdownTrigger}
                />
              )}

              {dropdownStatus && (
                <ul className="topbarDropdown" ref={dropdown}>
                  <Link
                    to={`${clientRoot}/users/${user.user._id}`}
                    className="routerLink"
                  >
                    <li
                      className="topbarDropdownProfile"
                      onClick={() => setDropdownStatus(!dropdownStatus)}
                    >
                      {user.user.profilePic ? (
                        <img
                          src={`${serverRoot}/images/${user.user.profilePic}`}
                          alt=""
                          className="topbarImg"
                        />
                      ) : (
                        <img
                          src={`${clientRoot}/assets/person/noAvatar.png`}
                          alt=""
                          className="topbarImg"
                        />
                      )}
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
