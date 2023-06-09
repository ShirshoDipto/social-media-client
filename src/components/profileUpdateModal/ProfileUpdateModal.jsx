import "./profileUpdateModal.css";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HouseIcon from "@mui/icons-material/House";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useRef, useState } from "react";
import ErrorComponent from "../ErrorComponent";
import {
  addPic,
  deletePic,
  replacePic,
  updateBio,
} from "../../profileUpdateApiCalls";

export default function ProfileUpdateModal({
  user,
  currUser,
  token,
  setIsModalOpen,
  setProfileInfos,
}) {
  const profileEditModalContainer = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const desc = useRef();
  const profilePic = useRef();
  const coverPic = useRef();
  const job = useRef();
  const edu = useRef();
  const city = useRef();
  const from = useRef();
  const relationship = useRef();
  const [isProfilePicChanged, setIsProfilePicChanged] = useState(false);
  const [isCoverPicChanged, setIsCoverPicChanged] = useState(false);
  const [profilePicImg, setProfilePicImg] = useState(null);
  const [coverPicImg, setCoverPicImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    msg: "",
    open: false,
  });

  const { dispatch } = useContext(AuthContext);

  const clientRoot = process.env.REACT_APP_CLIENTROOT;

  function removeProfilePic() {
    if (!isProfilePicChanged) {
      setIsProfilePicChanged(true);
    }

    setProfilePicImg(null);
    profilePic.current.value = "";
  }

  function removeCoverPic() {
    if (!isCoverPicChanged) {
      setIsCoverPicChanged(true);
    }

    setCoverPicImg(null);
    coverPic.current.value = "";
  }

  function handleSetProfilePic(e) {
    if (!isProfilePicChanged) {
      setIsProfilePicChanged(true);
    }

    if (e.target.files[0]) {
      setProfilePicImg(e.target.files[0]);
    }
  }

  function handleSetCoverPic(e) {
    if (!isCoverPicChanged) {
      setIsCoverPicChanged(true);
    }

    if (e.target.files[0]) {
      setCoverPicImg(e.target.files[0]);
    }
  }

  async function updateProfilePic() {
    if (!isProfilePicChanged) {
      return user.profilePic;
    }

    if (!user.profilePic && !profilePicImg) {
      return "";
    }

    if (profilePicImg && !user.profilePic) {
      return await addPic(profilePicImg, "p", user._id, token);
    }

    if (!profilePicImg && user.profilePic) {
      return await deletePic(user.profilePic, user._id, token);
    }

    if (profilePicImg && user.profilePic) {
      return await replacePic(
        user.profilePic,
        profilePicImg,
        "p",
        user._id,
        token
      );
    }
  }

  async function updateCoverPic() {
    if (!isCoverPicChanged) {
      return user.coverPic;
    }

    if (!user.coverPic && !coverPicImg) {
      return "";
    }

    if (coverPicImg && !user.coverPic) {
      return await addPic(coverPicImg, "c", user._id, token);
    }

    if (!coverPicImg && user.coverPic) {
      return await deletePic(user.coverPic, user._id, token);
    }

    if (coverPicImg && user.coverPic) {
      return await replacePic(user.coverPic, coverPicImg, "c", user._id, token);
    }
  }

  async function updateUserBio(profilePicName, coverPicName) {
    try {
      const data = {
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        profilePic: profilePicName,
        coverPic: coverPicName,
        desc: desc.current.value,
        job: job.current.value,
        edu: edu.current.value,
        city: city.current.value,
        from: from.current.value,
        relationship: relationship.current.value,
      };

      return updateBio(user._id, data, token);
    } catch (error) {
      throw error;
    }
  }

  async function handleErrorClose() {
    const newError = { ...error };
    newError.open = false;
    setError(newError);
  }

  async function handleErrorMsg(err) {
    const newError = { ...error };
    newError.open = true;
    if (err.error === "File too large") {
      newError.msg = "File has to be less than 5 MB";
    } else {
      console.log(err);
      newError.msg = err.error;
    }
    setError(newError);
  }

  async function updateProfile(e) {
    try {
      e.preventDefault();
      setIsLoading(true);

      const [profilePicUrl, coverPicUrl] = await Promise.all([
        updateProfilePic(),
        updateCoverPic(),
      ]);

      const updatedUser = await updateUserBio(profilePicUrl, coverPicUrl);
      const newUser = { ...updatedUser };
      newUser.friends = currUser.friends;

      dispatch({ type: "userUpdate", payload: newUser });
      updatedUser.friends = user.friends;
      setProfileInfos(updatedUser);
      setIsLoading(false);
      setIsModalOpen(false);
    } catch (err) {
      setIsLoading(false);
      handleErrorMsg(err);
    }
  }

  return (
    <div
      className="profileModalContainer"
      ref={profileEditModalContainer}
      onMouseDown={(e) => {
        e.target === profileEditModalContainer.current && setIsModalOpen(false);
      }}
    >
      <ErrorComponent error={error} handleErrorClose={handleErrorClose} />
      <div className="profileModalContent">
        <div className="profileModalHeader">
          <span className="profileModalHeaderText">Edit Profile</span>
          <div
            className="modalCancelContainer"
            onClick={() => setIsModalOpen(false)}
          >
            <ClearOutlinedIcon className="modalCancelIcon" />
          </div>
        </div>
        <form className="infoList" onSubmit={updateProfile}>
          <div className="infoListItem">
            <div className="infoListItemHeader">
              <span className="infoListItemHeaderTitle">Profile Photo</span>
              <span className="photoButtonsContainer">
                <div className="photoRemoveButton" onClick={removeProfilePic}>
                  Remove
                </div>
                <label htmlFor="profilePicInput" className="photoRemoveButton">
                  Change
                </label>
                <input
                  ref={profilePic}
                  type="file"
                  id="profilePicInput"
                  name="profilePic"
                  style={{ display: "none" }}
                  onChange={handleSetProfilePic}
                />
              </span>
            </div>
            <div className="modalPicContainer">
              <img
                src={
                  profilePicImg
                    ? URL.createObjectURL(profilePicImg)
                    : user.profilePic && !isProfilePicChanged
                    ? user.profilePic
                    : `${clientRoot}/assets/person/noAvatar.png`
                }
                alt=""
                className="modalProfilePic"
              />
            </div>
          </div>
          <div className="infoListItem">
            <div className="infoListItemHeader">
              <span className="infoListItemHeaderTitle">Cover Photo</span>
              <span className="photoButtonsContainer">
                <div className="photoRemoveButton" onClick={removeCoverPic}>
                  Remove
                </div>
                <label htmlFor="coverPicInput" className="photoRemoveButton">
                  Change
                </label>
                <input
                  ref={coverPic}
                  type="file"
                  id="coverPicInput"
                  name="coverPic"
                  style={{ display: "none" }}
                  onChange={handleSetCoverPic}
                />
              </span>
            </div>
            <div className="modalPicContainer">
              {coverPicImg ? (
                <img
                  src={URL.createObjectURL(coverPicImg)}
                  alt=""
                  className="modalCoverPic"
                />
              ) : user.coverPic && !isCoverPicChanged ? (
                <img src={user.coverPic} alt="" className="modalCoverPic" />
              ) : (
                <div className="editCoverImgContainer">
                  <div className="modalNoProfileCover">
                    <span className="noProfileCoverText">
                      No Cover Available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="infoListItem">
            <div className="infoListItemHeader">
              <span className="infoListItemHeaderTitle">Bio</span>
            </div>
            <div className="profileModalNameAndDesc">
              <div className="profileModalNameContainer">
                <input
                  ref={firstName}
                  className="modalEditInput"
                  type="text"
                  required
                  name="firstName"
                  maxLength={50}
                  placeholder="First Name"
                  defaultValue={user.firstName}
                />
                <input
                  ref={lastName}
                  className="modalEditInput"
                  type="text"
                  required
                  name="lastName"
                  maxLength={50}
                  placeholder="Last Name"
                  defaultValue={user.lastName}
                />
              </div>
              <input
                ref={desc}
                className="modalEditInput"
                type="text"
                name="desc"
                maxLength={50}
                placeholder="Tell us something about yourself"
                defaultValue={user.desc}
              />
            </div>
            <div className="modalBioContainer">
              <div className="modalFormGroup">
                <label htmlFor="modalEditWorksAt">
                  <BusinessCenterIcon className="profileInfoIcon" />
                  <span className="bioDesc">Workplace: </span>
                </label>
                <input
                  ref={job}
                  className="modalEditInput"
                  type="text"
                  id="modalEditWorksAt"
                  name="job"
                  maxLength={50}
                  defaultValue={user.job}
                />
              </div>
              <div className="modalFormGroup">
                <label htmlFor="modalEditUni">
                  <SchoolIcon className="profileInfoIcon" />
                  <span className="bioDesc">University/College: </span>
                </label>
                <input
                  ref={edu}
                  className="modalEditInput"
                  type="text"
                  id="modalEditUni"
                  name="edu"
                  maxLength={50}
                  defaultValue={user.edu}
                />
              </div>
              <div className="modalFormGroup">
                <label htmlFor="modalEditCurrTown">
                  <LocationOnIcon className="profileInfoIcon" />
                  <span className="bioDesc">Curent City/Town: </span>
                </label>
                <input
                  ref={city}
                  className="modalEditInput"
                  type="text"
                  id="modalEditCurrTown"
                  name="city"
                  maxLength={50}
                  defaultValue={user.city}
                />
              </div>
              <div className="modalFormGroup">
                <label htmlFor="modalEditHome">
                  <HouseIcon className="profileInfoIcon" />
                  <span className="bioDesc">Home Town: </span>
                </label>
                <input
                  ref={from}
                  className="modalEditInput"
                  type="text"
                  id="modalEditHome"
                  name="from"
                  maxLength={50}
                  defaultValue={user.from}
                />
              </div>
              <div className="modalFormGroup">
                <label htmlFor="modalEditRel">
                  <FavoriteIcon className="profileInfoIcon" />
                  <span className="bioDesc">Relationship: </span>
                </label>
                <select
                  type="text"
                  id="modalEditRel"
                  ref={relationship}
                  defaultValue={`${user.relationship}`}
                >
                  <option value="0" className="profileModalSelectOption">
                    I don't want to disclose
                  </option>
                  <option value="1" className="profileModalSelectOption">
                    Single
                  </option>
                  <option value="2" className="profileModalSelectOption">
                    Married
                  </option>
                  <option value="3" className="profileModalSelectOption">
                    In a Relationship
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="modalFormSubmitContainer">
            {isLoading && (profilePicImg || coverPicImg) && (
              <div className="loadingText">
                Please wait. Image upload will take some time.{" "}
                <b style={{ color: "tomato" }}>DO NOT</b> close the modal while
                update in progress.
              </div>
            )}
            <button className="modalFormSubmitButton">
              {isLoading ? (
                <CircularProgress
                  sx={{ color: grey[200] }}
                  size={12}
                  className="postSubmitLoading"
                  disableShrink
                />
              ) : (
                <span>Update</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
