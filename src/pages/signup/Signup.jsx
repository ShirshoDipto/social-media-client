import { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";
import GoogleIcon from "@mui/icons-material/Google";

export default function Signup() {
  const serverUri = process.env.REACT_APP_PROXY;
  const [errors, setErrors] = useState([]);
  const [userExistError, setUserExistError] = useState("");

  return (
    <div className="signup">
      <div className="signupWrapper">
        <div className="signupLeft">
          <h3 className="signupLogo">NoseBook</h3>
          <span className="signupDesc">
            Connect with friends and the world around you on NoseBook.
          </span>
        </div>
        <div className="signupRight">
          <div className="signupBox">
            <div className="signupNameGroup">
              <div className="signupFormgroup">
                {errors.firstName &&
                  errors.firstName.map((err) => {
                    return <span className="errorMsg">{err}</span>;
                  })}
                <input
                  className="signupInput"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                />
              </div>
              <div className="signupFormgroup">
                {errors.lastName &&
                  errors.lastName.map((err) => {
                    return <span className="errorMsg">{err}</span>;
                  })}
                <input
                  className="signupInput"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                />
              </div>
            </div>
            <div className="signupFormgroup">
              {errors.email &&
                errors.email.map((err) => {
                  return <span className="errorMsg">{err}</span>;
                })}
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="signupInput"
              />
            </div>
            <div className="signupFormgroup">
              {errors.email &&
                errors.email.map((err) => {
                  return <span className="errorMsg">{err}</span>;
                })}
              <input
                type="password"
                placeholder="Password"
                className="signupInput"
                name="password"
              />
            </div>
            <div className="signupFormgroup">
              {errors.email &&
                errors.email.map((err) => {
                  return <span className="errorMsg">{err}</span>;
                })}
              <input
                type="password"
                placeholder="Confirm Password"
                className="signupInput"
                name="ConfirmPassword"
              />
            </div>
            <button className="signupButton">Sign Up</button>
            <div className="signupRedirect">
              Already have an account?{" "}
              <Link to={"/login"}>
                <span className="anchorLike" to="/login">
                  Log In
                </span>
              </Link>
            </div>
            <div className="orContainer">
              <div className="orLeft"></div>
              <span className="or">Or</span>
              <div className="orRight"></div>
            </div>
            <button className="signupGoogleButton">
              <GoogleIcon color="action" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
