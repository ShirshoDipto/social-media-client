import "./topbar.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SearchBar from "../searchBar/SearchBar";
import FriendReq from "../friendReq/FriendReq";
import NewMsg from "../newMsg/NewMsg";
import GeneralNotification from "../generalNotification/GeneralNotification";

export default function Topbar({ user }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();

  async function handleLogout() {
    try {
      const res = await fetch(`${serverRoot}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.log(await res.json());
      }

      localStorage.removeItem("nosebookUser");
      window.location.replace("/");
    } catch (error) {
      console.log(error);
    }
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
        <SearchBar />
      </div>
      <div className="topbarRight">
        {user ? (
          <div className="topbarRightWrapper">
            <div className="topbarIcons">
              <div className="topbarIconItem">
                <FriendReq user={user} />
              </div>
              <Link to={`${clientRoot}/messenger`} className="routerLink">
                <div className="topbarIconItem">
                  <NewMsg user={user} />
                </div>
              </Link>
              <div className="topbarIconItem">
                <GeneralNotification user={user} />
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
