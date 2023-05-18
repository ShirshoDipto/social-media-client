import "./guestUser.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function GuestUser() {
  const { dispatch } = useContext(AuthContext);

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  async function handleGuestSignin() {
    try {
      const res = await fetch(`${serverRoot}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "mohammadroger6@gmail.com",
          password: "princeton01",
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }

      dispatch({ type: "login", payload: resData });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="guestUser">
      <button onClick={handleGuestSignin}>Continue with a guest user</button>
    </div>
  );
}
