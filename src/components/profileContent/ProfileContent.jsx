import "./profileContent.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HouseIcon from "@mui/icons-material/House";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import ProfileUpdateModal from "../profileUpdateModal/ProfileUpdateModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FriendshipStatus from "../friendshipStatus/FriendshipStatus";
import ProfilePosts from "../profilePosts/ProfilePosts";
import ProfileFriends from "../profileFriends/ProfileFriends";

export default function ProfileContent({ user }) {
  const [profileInfos, setProfileInfos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const params = useParams();

  useEffect(() => {
    async function fetchProfileInfos() {
      try {
        const res = await fetch(`${serverRoot}/api/users/${params.userId}`);

        const resData = await res.json();

        if (!res.ok) {
          throw resData;
        }

        setProfileInfos(resData.user);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProfileInfos();
  }, [params.userId, serverRoot]);

  return (
    <div className="profileContainer">
      {isLoading && (
        <div className="homeLoadingFixed">
          <CircularProgress className="loadingFixed" disableShrink />
        </div>
      )}
      <div className="profileWrapper">
        <div className="profileTop">
          <div className="profileCover">
            {profileInfos.coverPic ? (
              <img
                className="profileCoverImg"
                src={`${serverRoot}/images/${profileInfos.coverPic}`}
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
                profileInfos.profilePic
                  ? `${serverRoot}/images/${profileInfos.profilePic}`
                  : `${clientRoot}/assets/person/noAvatar.png`
              }
              alt=""
            />

            <div className="profileSummary">
              <div className="profileNameDescContainer">
                <h4 className="profileInfoName">
                  {`${profileInfos.firstName} ${profileInfos.lastName}`}
                </h4>
                {profileInfos.desc ? (
                  <span className="profileInfoDesc">{profileInfos.desc}</span>
                ) : (
                  <span className="profileInfoDesc">
                    No description available
                  </span>
                )}
              </div>

              {user && user.userInfo._id !== profileInfos._id && (
                <FriendshipStatus user={user} profileInfos={profileInfos} />
              )}
              {user && user.userInfo._id === profileInfos._id && (
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
                    {profileInfos.job ? (
                      <span className="profileInfoItemDesc">
                        Works at, <b>{profileInfos.job}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <SchoolIcon className="profileInfoIcon" />
                    {profileInfos.edu ? (
                      <span className="profileInfoItemDesc">
                        Studied at, <b>{profileInfos.edu}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <HouseIcon className="profileInfoIcon" />
                    {profileInfos.city ? (
                      <span className="profileInfoItemDesc">
                        Lives in, <b>{profileInfos.city}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <LocationOnIcon className="profileInfoIcon" />
                    {profileInfos.from ? (
                      <span className="profileInfoItemDesc">
                        From, <b>{[profileInfos.from]}</b>
                      </span>
                    ) : (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}
                  </div>
                  <div className="profileInfoItem">
                    <FavoriteIcon className="profileInfoIcon" />
                    {profileInfos.relationship === 0 && (
                      <span className="profileInfoItemDesc">
                        No info available.
                      </span>
                    )}

                    {profileInfos.relationship === 1 && (
                      <span className="profileInfoItemDesc">
                        Relationship status, <b>Single</b>
                      </span>
                    )}

                    {profileInfos.relationship === 2 && (
                      <span className="profileInfoItemDesc">
                        Relationship status, <b>Married</b>
                      </span>
                    )}

                    {profileInfos.relationship === 3 && (
                      <span className="profileInfoItemDesc">
                        Relationship status, <b>In a Relationship</b>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="profileInfoWrapper">
                <div className="profileSidebarTitle">Friends</div>
                <hr />
                <div className="profileFriendlist">
                  {profileInfos.friends?.length === 0 ? (
                    <div className="noFriendsText">No friends available.</div>
                  ) : (
                    profileInfos.friends?.map((fnd) => {
                      return <ProfileFriends key={fnd._id} fnd={fnd} />;
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          <ProfilePosts user={user} />
        </div>
      </div>
      {isModalOpen && (
        <ProfileUpdateModal
          user={profileInfos}
          token={user.token}
          setIsModalOpen={setIsModalOpen}
          setProfileInfos={setProfileInfos}
        />
      )}
    </div>
  );
}
