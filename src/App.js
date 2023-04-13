import Homepage from "./pages/hompage/Homepage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProfileContainer from "./components/profileContainer/ProfileContainer";
import ScrollToTop from "./ScrollToTop.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import GoogleLogin from "./pages/GoogleLogin";

function App() {
  const user = localStorage.getItem("nosebookUser");
  const [currentUser, setCurrentUser] = useState(JSON.parse(user));

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
