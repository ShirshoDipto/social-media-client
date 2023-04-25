import "./rightbar.css";

export default function Rightbar() {
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="birthdayContainer">
          <img src="/assets/gift.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Shusme Islam</b> and <b>3 others</b> have birthday today
          </span>
        </div>
      </div>
      <img src="/assets/ad.jpg" alt="" className="rightbarAd" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        <li className="rightbarFriend">
          <div className="rightbarProfileImgContainer">
            <img
              src="/assets/person/shusme.jpg"
              alt=""
              className="rightbarProfileImg"
            />
            <span className="rightbarOnline"></span>
          </div>
          <span className="rightbarUsername">Shusme Islam</span>
        </li>
        <li className="rightbarFriend">
          <div className="rightbarProfileImgContainer">
            <img
              src="/assets/person/shusme.jpg"
              alt=""
              className="rightbarProfileImg"
            />
            <span className="rightbarOnline"></span>
          </div>
          <span className="rightbarUsername">Shusme Islam</span>
        </li>
        <li className="rightbarFriend">
          <div className="rightbarProfileImgContainer">
            <img
              src="/assets/person/shusme.jpg"
              alt=""
              className="rightbarProfileImg"
            />
            <span className="rightbarOnline"></span>
          </div>
          <span className="rightbarUsername">Shusme Islam</span>
        </li>
        <li className="rightbarFriend">
          <div className="rightbarProfileImgContainer">
            <img
              src="/assets/person/shusme.jpg"
              alt=""
              className="rightbarProfileImg"
            />
            <span className="rightbarOnline"></span>
          </div>
          <span className="rightbarUsername">Shusme Islam</span>
        </li>
      </ul>
    </div>
  );
}
