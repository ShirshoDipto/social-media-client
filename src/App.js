import Homepage from "./pages/hompage/Homepage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Profile from "./pages/profile/Profile";
import Messenger from "./pages/messenger/Messenger";
import Topbar from "./components/topbar/Topbar";
import ScrollToTop from "./ScrollToTop.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "./socket";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

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

        const resData = await res.json();

        if (!res.ok) {
          throw console.log(resData);
        }

        localStorage.setItem("nosebookUser", JSON.stringify(resData));
        setCurrentUser({
          userInfo: resData.userInfo,
          token: resData.token,
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (!currentUser && window.location.search) {
      getUserFromGoogleAuth();
    }
  }, [serverRoot, currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.auth = { user: currentUser && currentUser };
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <Topbar user={currentUser} />
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
