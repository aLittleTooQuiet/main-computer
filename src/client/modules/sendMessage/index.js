export default (socket, msg) => {
  socket.send(msg.toString());
};
