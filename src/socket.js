import { io } from "socket.io-client";

const socketRoot = process.env.REACT_APP_SOCKETROOT;

export const socket = io(socketRoot, {
  autoConnect: false,
});

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });
