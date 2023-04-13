import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HouseIcon from "@mui/icons-material/House";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CircularProgress from "@mui/material/CircularProgress";
import Posts from "../../components/posts/Posts";
import { posts } from "../../dummyData";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile({ user }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const params = useParams();
  const [profileState, setProfileState] = useState({
    userPosts: [],
    isLoading: true,
    page: 0,
  });

  useEffect(() => {
    async function fetchUserPost() {
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/posts?page=${profileState.page}`
      );
      if (!res.ok) {
        setProfileState({
          userPosts: profileState.userPosts,
          isLoading: false,
          page: profileState.page,
        });
        return console.log(await res.json());
      }
      const resData = await res.json();
      if (resData.error) {
        return setProfileState({
          userPosts: profileState.userPosts,
          isLoading: false,
          page: profileState.page,
        });
      }

      return setProfileState({
        userPosts: resData.posts,
        isLoading: false,
        page: profileState.page + 1,
      });
    }
    fetchUserPost().catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <div className="profileContainer">
      <div className="profile">
        <div className="profileTop">
          <div className="profileCover">
            <img className="profileCoverImg" src="assets/post/3.jpeg" alt="" />
            <img
              className="profileUserImg"
              src="assets/person/profilePic.jpeg"
              alt=""
            />
            <div className="profileSummary">
              <div className="profileNameDescContainer">
                <h4 className="profileInfoName">Shirsho Dipto</h4>
                <span className="profileInfoDesc">Hello my friends!</span>
              </div>
              <div className="friendshipContainer">
                <div className="friendshipStatus">
                  <PeopleOutlinedIcon />
                  <span className="friendship">Friends</span>
                </div>
                <div className="messageContainer">
                  <MessageOutlinedIcon />
                  <span className="messageText">Message</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="profileBottom">
          <div className="profileSidebar">
            <div className="profileSidebarWrapper">
              <div className="profileInfoWrapper">
                <div className="profileSidebarTitle">Info</div>
                <hr />
                <div className="profileInfoItemContainer">
                  <div className="profileInfoItem">
                    <BusinessCenterIcon className="profileInfoIcon" />
                    <span className="profileInfoItemDesc">
                      Works at, <b>Random Coorporation</b>
                    </span>
                  </div>
                  <div className="profileInfoItem">
                    <SchoolIcon className="profileInfoIcon" />
                    <span className="profileInfoItemDesc">
                      Studied at, <b>School of Bull@#$%t, International</b>
                    </span>
                  </div>
                  <div className="profileInfoItem">
                    <HouseIcon className="profileInfoIcon" />
                    <span className="profileInfoItemDesc">
                      Lives in <b>Dhaka, Bangladesh</b>
                    </span>
                  </div>
                  <div className="profileInfoItem">
                    <LocationOnIcon className="profileInfoIcon" />
                    <span className="profileInfoItemDesc">
                      From <b>Dhaka, Bangladesh</b>
                    </span>
                  </div>
                  <div className="profileInfoItem">
                    <FavoriteIcon className="profileInfoIcon" />
                    <span className="profileInfoItemDesc">
                      Relationship status, <b>Married</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="profileInfoWrapper">
                <div className="profileSidebarTitle">Friends</div>
                <hr />
                <div className="profileFriendlist">
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/3.jpeg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/2.jpeg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                  <div className="profileFriend">
                    <img
                      src="/assets/person/shusme.jpg"
                      alt=""
                      className="profileFriendImg"
                    />
                    <span className="profileFriendName">Shusme Islam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profilePosts">
            <div className="profilePostsWrapper">
              <div className="profilePostsTitle">Posts</div>
              {profileState.isLoading ? (
                <CircularProgress className="userPostsLoading" disableShrink />
              ) : (
                <Posts posts={profileState.userPosts} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
