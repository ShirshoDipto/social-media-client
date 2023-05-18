import { useContext, useState } from "react";
import "./login.css";
import GoogleIcon from "@mui/icons-material/Google";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [errors, setErrors] = useState([]);
  const [userExistError, setUserExistError] = useState("");
  const { dispatch } = useContext(AuthContext);
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    try {
      const res = await fetch(`${serverRoot}/api/users/login`, {
        method: "POST",
        body: data,
      });

      const resData = await res.json();

      if (!res.ok) {
        setErrors([]);
        setUserExistError("");

        if (res.status === 401) {
          return setUserExistError("Invalid User. Create a new account. ");
        }

        if (resData.error) {
          return setUserExistError(resData.error);
        }

        return setErrors(resData.errors);
      }

      dispatch({ type: "login", payload: resData });
    } catch (error) {
      console.log(error);
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
                window.open(
                  "http://localhost:5000/api/users/login/google",
                  "_self"
                );
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
