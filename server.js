const express = require("express");
const mongoose = require("mongoose"); 
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const socketConnection = require("./src/service/socket");
const router = require("./src/routes/userRoutes")
const app = express();
app.use(express.json());
app.use("/", router);
// 2nd commit in server .js file
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  connectionStateRecovery: {}, 
});
const PORT = 3450;
socketConnection.connect(io);
mongoose
  .connect("mongodb://127.0.0.1:27017/socket-user")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
// changes from testing branch to merge all in main branch 
// testing in server to check commiting and push
// now commenting form other branch
// new freatyrebranch
// this is from othernew branch
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
