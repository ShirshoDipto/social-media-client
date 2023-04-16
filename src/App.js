import Homepage from "./pages/hompage/Homepage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProfileContainer from "./pages/profileContainer/ProfileContainer";
import ScrollToTop from "./ScrollToTop.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import GoogleLogin from "./pages/GoogleLogin";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function App() {
  const userFromLocalStorage = localStorage.getItem("nosebookUser");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(userFromLocalStorage)
  );

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
            element={<ProfileContainer user={currentUser} />}
          />
          <Route path="/login/google/confirm" element={<GoogleLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
