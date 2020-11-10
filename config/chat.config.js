const socket = require("socket.io");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("../utils/users");

module.exports = (server) => {
  const io = socket(server, {
    transports: ["websocket", "polling"],
  });

  io.on("connect", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
      console.log("connected");
      //Add user to room - it either returns an arroro or the user
      const { error, user } = addUser({ id: socket.id, name, room });
      console.log("user", user);

      if (error) return callback();
      // join user in a room

      socket.join(user.room);
      // ADMIN MESSAGE - welcome message in room : emit event from backend to frontend
      socket.emit("message", {
        user: "admin",
        text: `${user.name}, welcome to room ${user.room}.`,
      });
      // ADMIN MESSAGE -  send a mess to everyone in the chat
      socket.broadcast
        .to(user.room)
        .emit("message", { user: "admin", text: `${user.name} has joined!` });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    });
    //  USER MESSAGE -  sends message: expect event from front-end
    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);
      // send to - emit message body
      io.to(user.room).emit("message", { user: user.name, text: message });

      callback();
    });

    socket.on("disconnect", () => {
      console.log("disconn");
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit("message", {
          user: "Admin",
          text: `${user.name} has left.`,
        });
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });
  });
};
// io.on("connect", (socket) => {
//   socket.on("join", ({ name, room }, callback) => {
//     const { error, user } = addUser({ id: socket.id, name, room });

//     if (error) return callback(error);

//     socket.join(user.room);

//     socket.emit("message", {
//       user: "admin",
//       text: `${user.name}, welcome to room ${user.room}.`,
//     });
//     socket.broadcast
//       .to(user.room)
//       .emit("message", { user: "admin", text: `${user.name} has joined!` });

//     io.to(user.room).emit("roomData", {
//       room: user.room,
//       users: getUsersInRoom(user.room),
//     });

//     callback();
//   });

//   socket.on("sendMessage", (message, callback) => {
//     const user = getUser(socket.id);

//     io.to(user.room).emit("message", { user: user.name, text: message });

//     callback();
//   });

//   socket.on("disconnect", () => {
//     const user = removeUser(socket.id);

//     if (user) {
//       io.to(user.room).emit("message", {
//         user: "Admin",
//         text: `${user.name} has left.`,
//       });
//       io.to(user.room).emit("roomData", {
//         room: user.room,
//         users: getUsersInRoom(user.room),
//       });
//     }
//   });
// });
