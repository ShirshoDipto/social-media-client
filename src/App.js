import Homepage from "./pages/hompage/Homepage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Profile from "./pages/profile/Profile";
import ScrollToTop from "./ScrollToTop.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import GoogleLogin from "./pages/GoogleLogin";

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
    async function fetchUser() {
      try {
        const res = await fetch(
          `${serverRoot}/api/users/${currentUser.user._id}`
        );

        if (!res.ok) {
          throw await res.json();
        }

        const resData = await res.json();
        setCurrentUser({
          user: resData.user,
          token: currentUser.token,
        });
      } catch (error) {
        throw error;
      }
    }

    fetchUser().catch((err) => {
      return console.log(err);
    });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
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
          <Route path="/login/google/confirm" element={<GoogleLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
