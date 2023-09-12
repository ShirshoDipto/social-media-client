import "./contacts.css";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import Contact from "../contact/Contact";
import GroupsIcon from "@mui/icons-material/Groups";

export default function Contacts({ user }) {
  const [onlineFnds, setOnlineFnds] = useState([]);
  const [offlineFnds, setOfflineFnds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactsVisible, setIsContactsVisible] = useState(false);

  const contactsToggler = useRef();
  const contacts = useRef();
  const contactsWrapper = useRef();

  const serverRoot = process.env.REACT_APP_SERVERROOT;

  function handleContactsVisibility() {
    setIsContactsVisible(!isContactsVisible);
  }

  function hideContacts(e) {
    if (
      contacts.current &&
      contactsWrapper.current &&
      !contactsWrapper.current.contains(e.target) &&
      !contactsToggler.current.contains(e.target)
    ) {
      setIsContactsVisible(false);
    }
  }

  useEffect(() => {
    async function fetchCurrUser() {
      try {
        const res = await fetch(`${serverRoot}/api/users/${user.userInfo._id}`);
        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        setOfflineFnds(resData.user.friends);
        socket.emit("getFndsStatus", resData.user);
      } catch (error) {
        console.log(error);
      }
    }

    if (user) {
      fetchCurrUser();
    }

    setIsLoading(false);
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

  return (
    <>
      <div
        className={`contacts ${isContactsVisible ? "showContacts" : ""}`}
        ref={contacts}
        onClick={hideContacts}
      >
        {!isLoading && (
          <div
            className={`contactsWrapper ${
              isContactsVisible ? "showContactsWrapper" : ""
            }`}
            ref={contactsWrapper}
          >
            <h4 className="contactsTitle">Contacts</h4>
            <div className="contactsList">
              {!user ? (
                <span className="noFndsText">Log in to make friends</span>
              ) : (
                onlineFnds.length === 0 &&
                offlineFnds.length === 0 && (
                  <span className="noFndsText">No friends available</span>
                )
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
      {!isLoading && (
        <div
          className="groupIconContainer"
          ref={contactsToggler}
          onClick={handleContactsVisibility}
        >
          <GroupsIcon className="groupIcon" />
          <div className="groupIconMarker"></div>
        </div>
      )}
    </>
  );
}
