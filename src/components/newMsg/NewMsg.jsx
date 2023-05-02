import "./newMsg.css";
import ChatIcon from "@mui/icons-material/Chat";
import { useEffect, useRef, useState } from "react";

export default function NewMsg() {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const dropdown = useRef();
  const dropdownTrigger = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        !dropdownTrigger.current.contains(e.target)
      ) {
        setDropdownStatus(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="newMsg">
      <ChatIcon />
      <span className="topbarIconBadge">2</span>
    </div>
  );
}
