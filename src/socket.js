import { io } from "socket.io-client";

const serverRoot = process.env.REACT_APP_SERVERROOT;

export const socket = io(serverRoot, {
  autoConnect: false,
});

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });
