import { useEffect, useState } from "react";
import { socket } from "../../socket";
import Contact from "../contact/Contact";
import "./contacts.css";

export default function Contacts({ user }) {
  const [onlineFnds, setOnlineFnds] = useState([]);
  const [offlineFnds, setOfflineFnds] = useState([]);

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  useEffect(() => {
    if (!user) {
      return;
    }

    async function fetchCurrUser() {
      const res = await fetch(`${serverRoot}/api/users/${user.userInfo._id}`);
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      socket.emit("getFndsStatus", resData.user);
    }

    fetchCurrUser().catch((err) => {
      console.log(err);
    });
  }, [user, serverRoot]);

  useEffect(() => {
    function onFndsStatus({ online, offline }) {
      setOnlineFnds(online);
      setOfflineFnds(offline);
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
    }

    socket.on("receiveFndsStatus", onFndsStatus);
    socket.on("receiveUserStatus", onUserStatus);

    return () => {
      socket.off("receiveFndsStatus", onFndsStatus);
      socket.off("receiveUserStatus", onUserStatus);
    };
  }, [onlineFnds, offlineFnds]);

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
      <div className="contactsWrapper">
        <h4 className="contactsTitle">Contacts</h4>
        <div className="contactsList">
          {onlineFnds.length > 0 &&
            onlineFnds.map((fnd) => {
              return <Contact key={fnd._id} fnd={fnd} status={true} />;
            })}
          {offlineFnds.length > 0 &&
            offlineFnds.map((fnd) => {
              return <Contact key={fnd._id} fnd={fnd} status={false} />;
            })}
        </div>
      </div>
    </div>
  );
}
