import Homepage from "./pages/hompage/Homepage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Profile from "./pages/profile/Profile";
import ScrollToTop from "./ScrollToTop.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import GoogleLogin from "./pages/GoogleLogin";
import { socket } from "./socket";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import Messenger from "./pages/messenger/Messenger";
import Topbar from "./components/topbar/Topbar";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function App() {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const userFromLocalStorage = localStorage.getItem("nosebookUser");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(userFromLocalStorage)
  );

  useEffect(() => {
    async function getUserFromGoogleAuth() {
      try {
        const res = await fetch(`${serverRoot}/api/login/google/success`, {
          credentials: "include",
        });

        if (!res.ok) {
          return console.log(await res.json());
        }

        const resData = await res.json();

        localStorage.setItem("nosebookUser", JSON.stringify(resData));
        setCurrentUser({
          user: resData.user,
          token: resData.token,
        });
      } catch (err) {
        throw err;
      }
    }

    if (!currentUser && window.location.search) {
      getUserFromGoogleAuth().catch((err) => {
        return console.log(err);
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.auth = { userId: currentUser?.user._id };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        {/* <Topbar user={currentUser} /> */}
        <Routes>
          <Route path="/" element={<Homepage user={currentUser} />} />
          <Route
            path="/signup"
            element={currentUser ? <Homepage user={currentUser} /> : <Signup />}
          />
          <Route
            path="/login"
            element={currentUser ? <Homepage user={currentUser} /> : <Login />}
          />
          <Route
            path="/users/:userId"
            element={<Profile user={currentUser} />}
          />
          <Route
            path="/messenger"
            element={currentUser ? <Messenger user={currentUser} /> : <Login />}
          />
          <Route path="/login/google/confirm" element={<GoogleLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
