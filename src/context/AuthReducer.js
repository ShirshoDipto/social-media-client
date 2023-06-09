export default function AuthReducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };

    case "logout":
      return {
        user: null,
        isFetching: false,
        error: false,
      };

    case "userUpdate":
      const newUser = { ...state.user };
      newUser.userInfo = action.payload;
      return {
        user: newUser,
        isFetching: false,
        error: false,
      };

    default:
      return state;
  }
}
