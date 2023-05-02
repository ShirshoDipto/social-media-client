export default function SocketComponent() {
  // useEffect(() => {
  //   socket.connect();

  //   function onConnect() {
  //     setIsConnected(true);
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //     console.log("a user connected...");
  //   }

  //   function onChatMessage(msg) {
  //     console.log(msg);
  //   }

  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);
  //   socket.on("chat message", onChatMessage);

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     socket.disconnect();
  //   };
  // }, []);

  return <div></div>;
}
