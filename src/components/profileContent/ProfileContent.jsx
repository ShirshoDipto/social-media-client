import "./profileContent.css";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
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
import { useParams } from "react-router-dom";

export default function ProfileContent({ user }) {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const params = useParams();
  const [profileState, setProfileState] = useState({
    userBio: {},
    userPosts: [],
    isLoading: true,
    page: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUserInfos() {
      if (!profileState.isLoading) {
        setProfileState({
          userBio: profileState.userBio,
          userPosts: profileState.userPosts,
          isLoading: true,
          page: 0,
        });
      }
      const results = await Promise.all([
        fetch(`${serverRoot}/api/users/${params.userId}`),
        fetch(
          `${serverRoot}/api/users/${params.userId}/posts?page=${profileState.page}`
        ),
      ]);

      if (!results[0].ok || !results[1].ok) {
        setProfileState({
          userBio: {},
          userPosts: profileState.userPosts,
          isLoading: false,
          page: profileState.page,
        });
        console.log(await results[0].json());
        console.log(await results[1].json());
        return;
      }

      const userBioData = await results[0].json();
      const userPostsData = await results[1].json();

      return setProfileState({
        userBio: userBioData.user,
        userPosts: userPostsData.posts,
        isLoading: false,
        page: profileState.page + 1,
      });
    }

    fetchUserInfos().catch((err) => {
      console.log(err);
    });
  }, [params.userId]);

  if (profileState.isLoading) {
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
            {profileState.userBio.coverPic ? (
              <img
                className="profileCoverImg"
                src={`${serverRoot}/images/${profileState.userBio.coverPic}`}
                alt=""
              />
            ) : (
              <div className="noProfileCover">
                <span className="noProfileCoverText">No Cover Available</span>
              </div>
            )}

            {profileState.userBio.profilePic ? (
              <img
                className="profileUserImg"
                src={`${serverRoot}/images/${profileState.userBio.profilePic}`}
                alt=""
              />
            ) : (
              <img
                className="profileUserImg"
                src={`${clientRoot}/assets/person/noAvatar.png`}
                alt=""
              />
            )}

            <div className="profileSummary">
              <div className="profileNameDescContainer">
                <h4 className="profileInfoName">
                  {`${profileState.userBio.firstName} ${profileState.userBio.lastName}`}
                </h4>
                {profileState.userBio.desc ? (
                  <span className="profileInfoDesc">
                    {profileState.userBio.desc}
                  </span>
                ) : (
                  <span className="profileInfoDesc">
                    No description available
                  </span>
                )}
              </div>

              {user && user.user._id !== profileState.userBio._id ? (
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
              ) : (
                <div
                  className="editProfileContainer"
                  onClick={() => setIsModalOpen(true)}
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
                    {profileState.userBio.job ? (
                      <span className="profileInfoItemDesc">
                        Works at, <b>{profileState.userBio.job}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <SchoolIcon className="profileInfoIcon" />
                    {profileState.userBio.edu ? (
                      <span className="profileInfoItemDesc">
                        Studied at, <b>{profileState.userBio.edu}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <HouseIcon className="profileInfoIcon" />
                    {profileState.userBio.city ? (
                      <span className="profileInfoItemDesc">
                        Lives in, <b>{profileState.userBio.city}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <LocationOnIcon className="profileInfoIcon" />
                    {profileState.userBio.from ? (
                      <span className="profileInfoItemDesc">
                        From, <b>{[profileState.userBio.from]}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <FavoriteIcon className="profileInfoIcon" />
                    {profileState.userBio.relationship === 0 && (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}

                    {profileState.userBio.relationship === 1 && (
                      <span className="profileInfoItemDesc">
                        Relationship status, <b>In a realtoinship</b>
                      </span>
                    )}

                    {profileState.userBio.relationship === 2 && (
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
                  {profileState.userBio.friends.length === 0 ? (
                    <div className="noFriendsText">No friends available.</div>
                  ) : (
                    profileState.userBio.friends.map((fnd) => {
                      return (
                        <div className="profileFriend">
                          {fnd.profilePic ? (
                            <img
                              src={`${serverRoot}/images/${fnd.profilePic}`}
                              alt=""
                              className="profileFriendImg"
                            />
                          ) : (
                            <img
                              src={`${clientRoot}/assets/person/noAvatar.png`}
                              alt=""
                              className="profileFriendImg"
                            />
                          )}
                          <span className="profileFriendName">
                            {`${fnd.firstName} ${fnd.lastName}`}
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
              <Posts user={user} posts={profileState.userPosts} />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ProfileUpdateModal
          user={profileState.userBio}
          token={user.token}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}
