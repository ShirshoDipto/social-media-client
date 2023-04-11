import { useState } from "react";
import "./login.css";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
  const serverUri = process.env.REACT_APP_PROXY;
  const [errors, setErrors] = useState([]);
  const [userExistError, setUserExistError] = useState("");

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">NoseBook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on NoseBook.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <div className="emailInputGroup">
              {errors.email &&
                errors.email.map((err) => {
                  return <span className="error-msg">{err}</span>;
                })}
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="loginInput"
              />
            </div>
            <div className="passwordInputGroup">
              {errors.email &&
                errors.email.map((err) => {
                  return <span className="error-msg">{err}</span>;
                })}
              <input
                type="password"
                placeholder="Password"
                className="loginInput"
                name="password"
              />
              <span className="loginForgot">Forgot Password?</span>
            </div>
            <button className="loginButton">Log In</button>
            <button className="loginRegisterButton">
              Create a New Account
            </button>
            <div className="orContainer">
              <div className="orLeft"></div>
              <span className="or">Or</span>
              <div className="orRight"></div>
            </div>
            <button className="loginGoogleButton">
              <GoogleIcon color="disabled" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
