import "./profileContent.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HouseIcon from "@mui/icons-material/House";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import Posts from "../posts/Posts";
import ProfileUpdateModal from "../profileUpdateModal/ProfileUpdateModal";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FriendshipStatus from "../friendshipStatus/FriendshipStatus";

export default function ProfileContent({ user }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const params = useParams();
  const [userBio, setUserBio] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [friendship, setFriendship] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMorePostsLoading, setIsMorePostsLoading] = useState(false);
  const [isNoMorePosts, setIsNoMorePosts] = useState(false);

  async function loadMorePosts() {
    try {
      setIsMorePostsLoading(true);

      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/posts?skip=${userPosts.length}`
      );

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      if (resData.posts.length < 10) {
        setIsNoMorePosts(true);
      }

      setUserPosts([...userPosts, ...resData.posts]);
      setIsMorePostsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchUserBio() {
    try {
      const res = await fetch(`${serverRoot}/api/users/${params.userId}`);

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      return resData.user;
    } catch (error) {
      throw error;
    }
  }

  async function fetchUserFriendship() {
    if (!user || user.userInfo._id.toString() === params.userId.toString()) {
      return null;
    }

    try {
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/friendships`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      return resData.friendship;
    } catch (error) {
      throw error;
    }
  }

  async function fetchUserPosts() {
    try {
      const res = await fetch(
        `${serverRoot}/api/users/${params.userId}/posts?skip=${userPosts.length}`
      );

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      return resData.posts;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    async function fetchUserInfos() {
      try {
        const results = await Promise.all([
          fetchUserBio(),
          fetchUserPosts(),
          fetchUserFriendship(),
        ]);

        if (results[1].length < 10) {
          setIsNoMorePosts(true);
        }
        setUserBio(results[0]);
        setUserPosts(results[1]);
        setFriendship(results[2]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserInfos().catch((err) => {
      console.log(err);
    });

    return () => {
      setIsLoading(true);
      setIsNoMorePosts(false);
    };
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return (
      <div className="profileContainer">
        <CircularProgress className="profileLoading" disableShrink />
      </div>
    );
  }

  return (
    <div className="profileContainer">
      <div className="profile">
        <div className="profileTop">
          <div className="profileCover">
            {userBio.coverPic ? (
              <img
                className="profileCoverImg"
                src={`${serverRoot}/images/${userBio.coverPic}`}
                alt=""
              />
            ) : (
              <div className="noProfileCover">
                <span className="noProfileCoverText">No Cover Available</span>
              </div>
            )}
            <img
              className="profileUserImg"
              src={
                userBio.profilePic
                  ? `${serverRoot}/images/${userBio.profilePic}`
                  : `${clientRoot}/assets/person/noAvatar.png`
              }
              alt=""
            />

            <div className="profileSummary">
              <div className="profileNameDescContainer">
                <h4 className="profileInfoName">
                  {`${userBio.firstName} ${userBio.lastName}`}
                </h4>
                {userBio.desc ? (
                  <span className="profileInfoDesc">{userBio.desc}</span>
                ) : (
                  <span className="profileInfoDesc">
                    No description available
                  </span>
                )}
              </div>

              {user && user.userInfo._id !== userBio._id && (
                <FriendshipStatus
                  user={user}
                  userBio={userBio}
                  friendship={friendship}
                  setFriendship={setFriendship}
                />
              )}
              {user && user.userInfo._id === userBio._id && (
                <div
                  className="editProfileContainer"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  <EditIcon sx={{ fontSize: 17 }} className="profileEditIcon" />
                  <span className="profileEditText">Edit Profile</span>
                </div>
              )}
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
                    {userBio.job ? (
                      <span className="profileInfoItemDesc">
                        Works at, <b>{userBio.job}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <SchoolIcon className="profileInfoIcon" />
                    {userBio.edu ? (
                      <span className="profileInfoItemDesc">
                        Studied at, <b>{userBio.edu}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <HouseIcon className="profileInfoIcon" />
                    {userBio.city ? (
                      <span className="profileInfoItemDesc">
                        Lives in, <b>{userBio.city}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <LocationOnIcon className="profileInfoIcon" />
                    {userBio.from ? (
                      <span className="profileInfoItemDesc">
                        From, <b>{[userBio.from]}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <FavoriteIcon className="profileInfoIcon" />
                    {userBio.relationship === 0 && (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}

                    {userBio.relationship === 1 && (
                      <span className="profileInfoItemDesc">
                        Relationship status, <b>In a realtoinship</b>
                      </span>
                    )}

                    {userBio.relationship === 2 && (
                      <span className="profileInfoItemDesc">
                        Relationship status, <b>Married</b>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="profileInfoWrapper">
                <div className="profileSidebarTitle">Friends</div>
                <hr />
                <div className="profileFriendlist">
                  {userBio.friends.length === 0 ? (
                    <div className="noFriendsText">No friends available.</div>
                  ) : (
                    userBio.friends.map((fnd) => {
                      return (
                        <div key={fnd._id} className="profileFriend">
                          <img
                            src={
                              fnd.profilePic
                                ? `${serverRoot}/images/${fnd.profilePic}`
                                : `${clientRoot}/assets/person/noAvatar.png`
                            }
                            alt=""
                            className="profileFriendImg"
                          />

                          <span className="profileFriendName">
                            <Link
                              className="routerLink"
                              to={`${clientRoot}/users/${fnd._id}`}
                            >
                              {`${fnd.firstName} ${fnd.lastName}`}
                            </Link>
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="profilePosts">
            <div className="profilePostsWrapper">
              <div className="profilePostsTitle">Posts</div>
              <Posts user={user} posts={userPosts} setPosts={setUserPosts} />
              {isMorePostsLoading ? (
                <CircularProgress className="postsLoading" disableShrink />
              ) : isNoMorePosts ? (
                userPosts.length === 0 ? (
                  <span className="noMorePoststext">No posts available. </span>
                ) : (
                  <span className="noMorePoststext">
                    No more posts available.
                  </span>
                )
              ) : (
                <button className="postLoadMore" onClick={loadMorePosts}>
                  Load more...
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ProfileUpdateModal
          user={userBio}
          token={user.token}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}
