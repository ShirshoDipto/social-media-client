import { useState } from "react";
import "./login.css";
import GoogleIcon from "@mui/icons-material/Google";
import { Link } from "react-router-dom";

export default function Login() {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const [errors, setErrors] = useState([]);
  const [userExistError, setUserExistError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    const res = await fetch(`${serverRoot}/api/login`, {
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

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <Link to={"/"} className="routerLink">
            <h3 className="loginLogo">NoseBook</h3>
          </Link>
          <span className="loginDesc">
            Connect with friends and the world around you on NoseBook.
          </span>
        </div>
        <div className="loginRight">
          <div className="userExistDiv">{userExistError}</div>
          <form className="loginBox" onSubmit={handleLogin}>
            <div className="loginFormgroup">
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
                className="loginInput"
              />
            </div>
            <div className="loginFormgroup">
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
                className="loginInput"
                name="password"
              />
              <span className="loginForgot">Forgot Password?</span>
            </div>
            <button type="submit" className="loginButton">
              Log In
            </button>
            <Link to={"/signup"}>
              <button type="button" className="loginRegisterButton">
                Create a New Account
              </button>
            </Link>
            <div className="orContainer">
              <div className="orLeft"></div>
              <span className="or">Or</span>
              <div className="orRight"></div>
            </div>
            <button
              type="button"
              className="loginGoogleButton"
              onClick={() => {
                window.open("http://localhost:5000/api/login/google", "_self");
              }}
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
