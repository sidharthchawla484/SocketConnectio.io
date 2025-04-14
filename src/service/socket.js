const socketAuth = require("../middleware/socketAuth")
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const Group = require("../models/group-model")
const socketController = require("../controllers/socketController")
let socketConnection = {};

socketConnection.connect = (io) => {

  io.use(socketAuth);
  io.on("connection", (socket) => {

    socket.on("joinRoom", (payload) => {
      console.log(`${socket.user.mobile} =====joined room====: ${payload.room}`);
      socket.join(payload.room);
      io.to(payload.room).emit("joinRoom", { msg: "new user joined" })
    });

    socket.on("joinGroup", async (payload) => {
      try {
        const { groupId, mobile } = payload
        const token = socket.handshake.query?.token;
        const user = await User.findOne({ mobile })
        // console.log("user", user.mobile);
        // const userMobile = user.mobile.toString()
        // console.log("payload", payload.mobile);
        // if (userMobile != payload.mobile) {
        //   return socket.emit("joinGroup", { msg: `no user found` })
        // }
        console.log("userIDDDDD", user._id.toString());
        const tokenDecode = jwt.verify(token, "suerSocket")
        console.log("tokendecodee", tokenDecode._id);
        if (user._id.toString() != tokenDecode._id) {
          return socket.emit("joinGroup", { msg: ` invalid token` })
        }
        console.log("user", user.mobile);

        const group = await Group.findOne({ groupId });
        if (!group) {
          return socket.emit("joinGroup", { msg: `groupId ${groupId} not exists` })
        }

        if (group.members.includes(user._id)) {
          console.log("user already exists");
          return socket.emit("joinGroup", { msg: "User is already a member" });

        }
        group.members.push(user._id);

        await group.save();
        socket.join(groupId)
        io.to(groupId).emit("joinGroup", {
          msg: `${mobile} joined group ====>>>: ${groupId}`,
          groupId,
          mobile
        });
        console.log(`${payload.mobile} joined group====>>: ${payload.groupId}`);
      } catch (error) {
        console.log("error at join group", error);
        return socket.emit("joinGroup", { msg: "server error" })
      }
    })
    socket.on("leaveGroup", async (payload) => {
      try {
        const { groupId, mobile } = payload;
        const token = socket.handshake.query?.token;
    
        const user = await User.findOne({ mobile });
        if (!user) {
          return socket.emit("leaveGroup", { msg: `User not found` });
        }
    
        const tokenDecode = jwt.verify(token, "suerSocket");
        if (user._id.toString() !== tokenDecode._id) {
          return socket.emit("leaveGroup", { msg: `Invalid token` });
        }
    
        const group = await Group.findOne({ groupId });
        if (!group) {
          return socket.emit("leaveGroup", { msg: `Group ID ${groupId} not found` });
        }
    
        if (!group.members.includes(user._id)) {
          return socket.emit("leaveGroup", { msg: `User is not a member of the group` });
        }
        group.members.pull(user._id);
        await group.save();
        io.to(groupId).emit("leaveGroup", {
          msg: `${mobile} left the group: ${groupId}`,
          groupId,
          mobile
        });
        socket.leave(groupId);
        console.log(`${mobile} left group: ${groupId}`);    
      } catch (error) {
        console.error("Error in leaveRoom:", error);
        socket.emit("leaveGroup", { msg: "Server error while leaving group" });
      }
    });
    

    socket.on("sendMessage", (data) => {
      const { message, groupId } = data;
      console.log(`${socket.user.mobile} sent a message: ${message}`);
      if (groupId) {

        io.to(groupId).emit("receiveMessage", {
          username: socket.user.mobile,
          message,
        });
      } else {
        socket.broadcast.emit("receiveMessage", {
          username: socket.user.mobile,
          message,
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.mobile}`);
    });
  });
};

module.exports = socketConnection;
