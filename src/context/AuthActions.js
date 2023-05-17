export function LoginStart() {
  return {
    type: "LOGIN_START",
  };
}

export function LoginSuccess(user) {
  return {
    type: "LOGIN_SUCCESS",
    payload: user,
  };
}

export function LoginFailure(error) {
  return {
    type: "LOGIN_FAILURE",
    payload: error,
  };
}

export function LoginFailure() {
  return {
    type: "LOGOUT",
  };
}
