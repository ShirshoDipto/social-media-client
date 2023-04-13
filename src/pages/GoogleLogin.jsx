import { useEffect } from "react";

export default function GoogleLogin() {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(`${serverRoot}/api/login/google/success`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.log(await res.json());
        }

        const resData = await res.json();

        localStorage.setItem("nosebookUser", JSON.stringify(resData));
        window.location.replace("/");
      } catch (err) {
        console.log(err);
      }
    }
    getUser().catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <div className="googleConfirm">
      <span className="googleRedirecting">Redirecting...</span>
    </div>
  );
}
