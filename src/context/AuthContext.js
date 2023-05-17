import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const userFromLocalStorage = localStorage.getItem("nosebookUser");

const INITIAL_STATE = {
  user: JSON.parse(userFromLocalStorage),
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("nosebookUser", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
