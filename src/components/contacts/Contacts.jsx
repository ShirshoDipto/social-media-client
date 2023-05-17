import "./contacts.css";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import Contact from "../contact/Contact";

export default function Contacts({ user }) {
  const [onlineFnds, setOnlineFnds] = useState([]);
  const [offlineFnds, setOfflineFnds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  useEffect(() => {
    async function fetchCurrUser() {
      try {
        const res = await fetch(`${serverRoot}/api/users/${user.userInfo._id}`);
        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        socket.emit("getFndsStatus", resData.user);
      } catch (error) {
        console.log(error);
      }
    }

    if (user) {
      fetchCurrUser();
    }
  }, [user, serverRoot]);

  useEffect(() => {
    function onFndsStatus({ online, offline }) {
      setOnlineFnds(online);
      setOfflineFnds(offline);
      setIsLoading(false);
    }

    function onUserStatus({ userId, status }) {
      let userToShift;
      if (status) {
        let newOfflineFnds = [];
        offlineFnds.forEach((fnd) => {
          if (fnd._id !== userId) {
            newOfflineFnds.push({ ...fnd });
          } else {
            userToShift = { ...fnd };
          }
        });
        setOfflineFnds(newOfflineFnds);
        setOnlineFnds([userToShift, ...onlineFnds]);
      } else {
        let newOnlineFnds = [];
        onlineFnds.forEach((fnd) => {
          if (fnd._id !== userId) {
            newOnlineFnds.push({ ...fnd });
          } else {
            userToShift = { ...fnd };
          }
        });
        setOnlineFnds(newOnlineFnds);
        setOfflineFnds([userToShift, ...offlineFnds]);
      }
      setIsLoading(false);
    }

    socket.on("receiveFndsStatus", onFndsStatus);
    socket.on("receiveUserStatus", onUserStatus);

    return () => {
      socket.off("receiveFndsStatus", onFndsStatus);
      socket.off("receiveUserStatus", onUserStatus);
    };
  }, [onlineFnds, offlineFnds, isLoading]);

  if (!user) {
    return (
      <div className="contacts">
        <div className="contactsWrapper">
          <h4 className="contactsTitle">Contacts</h4>
          <div className="contactsList">
            <span className="noFndsText">Log in to make friends</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contacts">
      {isLoading ? null : (
        <div className="contactsWrapper">
          <h4 className="contactsTitle">Contacts</h4>
          <div className="contactsList">
            {onlineFnds.length === 0 && offlineFnds.length === 0 && (
              <span className="noFndsText">No friends available</span>
            )}
            {onlineFnds.length > 0 &&
              onlineFnds.map((fnd) => {
                if (fnd) {
                  return <Contact key={fnd._id} fnd={fnd} status={true} />;
                } else {
                  return null;
                }
              })}
            {offlineFnds.length > 0 &&
              offlineFnds.map((fnd) => {
                if (fnd) {
                  return <Contact key={fnd._id} fnd={fnd} status={false} />;
                } else {
                  return null;
                }
              })}
          </div>
        </div>
      )}
    </div>
  );
}
