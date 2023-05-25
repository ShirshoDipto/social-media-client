import "./topbar.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import SearchBar from "../searchBar/SearchBar";
import NewMsgNotifs from "../newMsgNotifs/NewMsgNotifs";
import GeneralNotifs from "../generalNotifs/GeneralNotifs";
import FriendReqNotifs from "../friendReqNotifs/FriendReqNotifs";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ user }) {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const location = useLocation();

  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  const url = new URL(window.location.href);
  const userId = url.searchParams.get("google");

  const fullname = user?.userInfo.firstName + " " + user?.userInfo.lastName;

  async function handleLogout() {
    try {
      const res = await fetch(`${serverRoot}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      dispatch({ type: "logout" });
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

  if (
    (location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/messenger") &&
    !user
  ) {
    return null;
  }

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
                <FriendReqNotifs user={user} />
              </div>
              <div className="topbarIconItem">
                <NewMsgNotifs user={user} />
              </div>
              <div className="topbarIconItem">
                <GeneralNotifs user={user} />
              </div>
            </div>
            <div className="topbarDropdownContainer">
              <img
                src={
                  user.userInfo.profilePic
                    ? user.userInfo.profilePic
                    : `${clientRoot}/assets/person/noAvatar.png`
                }
                alt=""
                className="topbarImg"
                onClick={() => {
                  setDropdownStatus(!dropdownStatus);
                }}
                ref={dropdownTrigger}
              />

              {dropdownStatus && (
                <ul className="topbarDropdown" ref={dropdown}>
                  <Link
                    to={`${clientRoot}/users/${user.userInfo._id}`}
                    className="routerLink"
                  >
                    <li
                      className="topbarDropdownProfile"
                      onClick={() => setDropdownStatus(!dropdownStatus)}
                    >
                      <img
                        src={
                          user.userInfo.profilePic
                            ? user.userInfo.profilePic
                            : `${clientRoot}/assets/person/noAvatar.png`
                        }
                        alt=""
                        className="topbarImg"
                      />
                      <span className="dropdownProfileName">{fullname}</span>
                    </li>
                  </Link>
                  <hr className="dropdownHr" />
                  <li
                    className="topbarDropdownLogout"
                    onClick={() => {
                      handleLogout();
                      setDropdownStatus(false);
                    }}
                  >
                    <LogoutIcon className="logoutIcon" />
                    <span className="logoutText">Logout</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        ) : (
          !userId && (
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
          )
        )}
      </div>
    </div>
  );
}
