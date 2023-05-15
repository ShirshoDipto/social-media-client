import "./signup.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

export default function Signup() {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const [errors, setErrors] = useState([]);
  const [userExistError, setUserExistError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    const res = await fetch(`${serverRoot}/api/signup`, {
      method: "POST",
      body: data,
    });

    let resData;

    if (!res.ok) {
      setErrors([]);
      setUserExistError("");

      if (res.status === 401) {
        return setUserExistError("Invalid User. Create a new account. ");
      }

      resData = await res.json();
      if (resData.error) {
        return setUserExistError(resData.error);
      }

      return setErrors(resData.errors);
    } else {
      resData = await res.json();
      localStorage.setItem("nosebookUser", JSON.stringify(resData));
      window.location.replace("/");
    }
  }

  async function handleGoogleLogin() {
    window.open("http://localhost:5000/api/login/google", "_self");
  }

  return (
    <div className="signup">
      <div className="signupWrapper">
        <div className="signupLeft">
          <Link to={"/"} className="routerLink">
            <h3 className="signupLogo">NoseBook</h3>
          </Link>
          <span className="signupDesc">
            Connect with friends and the world around you on NoseBook.
          </span>
        </div>
        <div className="signupRight">
          <div className="userExistDiv">{userExistError}</div>
          <form className="signupBox" onSubmit={handleSignup}>
            <div className="signupNameGroup">
              <div className="signupFormgroup">
                {errors.firstName &&
                  errors.firstName.map((err, i) => {
                    return (
                      <span key={i} className="errorMsg">
                        {err}
                      </span>
                    );
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
                  errors.lastName.map((err, i) => {
                    return (
                      <span key={i} className="errorMsg">
                        {err}
                      </span>
                    );
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
                errors.email.map((err, i) => {
                  return (
                    <span key={i} className="errorMsg">
                      {err}
                    </span>
                  );
                })}
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="signupInput"
              />
            </div>
            <div className="signupFormgroup">
              {errors.password &&
                errors.password.map((err, i) => {
                  return (
                    <span key={i} className="errorMsg">
                      {err}
                    </span>
                  );
                })}
              <input
                type="password"
                placeholder="Password"
                className="signupInput"
                name="password"
              />
            </div>
            <div className="signupFormgroup">
              {errors.confirmPassword &&
                errors.confirmPassword.map((err, i) => {
                  return (
                    <span key={i} className="errorMsg">
                      {err}
                    </span>
                  );
                })}
              <input
                type="password"
                placeholder="Confirm Password"
                className="signupInput"
                name="confirmPassword"
              />
            </div>
            <button type="submit" className="signupButton">
              Sign Up
            </button>
            <div className="signupRedirect">
              Already have an account?{" "}
              <Link to={"/login"} className="routerLink">
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
            <button
              type="button"
              className="signupGoogleButton"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon color="action" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
