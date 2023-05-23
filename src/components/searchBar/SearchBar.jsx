import "./searchBar.css";
import { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

export default function SearchBar() {
  const serverRoot = process.env.REACT_APP_SERVERROOT;
  const clientRoot = process.env.REACT_APP_CLIENTROOT;
  const dropdown = useRef();
  const dropdownTrigger = useRef();
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  async function handleSearchForPeople(e) {
    try {
      const res = await fetch(
        `${serverRoot}/api/users/search?text=${e.target.value}`
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      setIsLoading(false);
      setSearchResult(resData.searchResult);
    } catch (error) {
      console.log(error);
    }
  }

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
    <div className="searchbar">
      <SearchIcon className="searchIcon" />
      <input
        type="text"
        placeholder="Search for People"
        className="searchInput"
        ref={dropdownTrigger}
        onClick={(e) => {
          if (e.target.value.length !== 0) {
            setDropdownStatus(true);
          }
        }}
        onChange={(e) => {
          setDropdownStatus(true);
          setIsLoading(true);
          handleSearchForPeople(e);
        }}
      />
      {dropdownStatus && (
        <div className="searchDropdownContainer" ref={dropdown}>
          {isLoading ? (
            <div className="searchLoadingContainer">
              <CircularProgress
                size={15}
                className="searchLoading"
                disableShrink
              />
            </div>
          ) : searchResult.length !== 0 ? (
            <ul className="searchResultList">
              {searchResult.map((result) => {
                return (
                  <Link
                    to={`${clientRoot}/users/${result._id}`}
                    className="routerLink"
                    key={result._id}
                  >
                    <li
                      className="searchResultListItem"
                      onClick={() => {
                        dropdownTrigger.current.value = "";
                        setDropdownStatus(false);
                      }}
                    >
                      <img
                        src={
                          result.profilePic
                            ? result.profilePic
                            : `${clientRoot}/assets/person/noAvatar.png`
                        }
                        alt="asdsad"
                        className="searchImg"
                      />
                      <span className="searchResultName">{`${result.firstName} ${result.lastName}`}</span>
                    </li>
                  </Link>
                );
              })}
            </ul>
          ) : (
            <div className="noResultsFoundText">No Results Found.</div>
          )}
        </div>
      )}
    </div>
  );
}
