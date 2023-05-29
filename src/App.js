import "./App.css";
import Homepage from "./pages/hompage/Homepage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Profile from "./pages/profile/Profile";
import Messenger from "./pages/messenger/Messenger";
import Topbar from "./components/topbar/Topbar";
import ScrollToTop from "./ScrollToTop.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { socket } from "./socket";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import { AuthContext } from "./context/AuthContext";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function App() {
  const serverRoot = process.env.REACT_APP_SERVERROOT;

  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    async function getUserFromGoogleAuth() {
      try {
        const url = new URL(window.location.href);
        const userId = url.searchParams.get("google");
        const res = await fetch(
          `${serverRoot}/api/users/login/google/success?userId=${userId}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );

        const resData = await res.json();

        if (!res.ok) {
          throw resData;
        }

        dispatch({ type: "login", payload: resData });
        window.history.pushState({}, "", process.env.REACT_APP_CLIENTROOT);
      } catch (error) {
        console.log(error);
      }
    }

    if (!user && window.location.search) {
      getUserFromGoogleAuth();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      socket.auth = { user: user && user };
      socket.connect();
    }

    function onConnectError(error) {
      console.log(error);
    }

    function onInternalError(error) {
      console.log(error);
    }

    socket.on("connect_error", onConnectError);
    socket.on("internalError", onInternalError);
    return () => {
      socket.off("connect_error", onConnectError);
      socket.off("internalError", onInternalError);
      socket.disconnect();
    };
  }, [user]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <Topbar user={user} />
        <Routes>
          <Route
            path="/"
            element={<Homepage key={user?.userInfo._id} user={user} />}
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Homepage key={user.userInfo._id} user={user} />
              ) : (
                <Signup />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Homepage key={user.userInfo._id} user={user} />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/users/:userId" element={<Profile user={user} />} />
          <Route
            path="/messenger"
            element={user ? <Messenger user={user} /> : <Login />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
