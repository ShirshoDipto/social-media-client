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
        const res = await fetch(
          `${serverRoot}/api/users/login/google/success`,
          {
            credentials: "include",
          }
        );

        const resData = await res.json();

        if (!res.ok) {
          throw console.log(resData);
        }

        dispatch({ type: "login", payload: resData });
      } catch (error) {
        console.log(error);
      }
    }

    if (!user && window.location.search) {
      getUserFromGoogleAuth();
    }
  }, [serverRoot, user, dispatch]);

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
