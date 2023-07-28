const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://192.168.101.161:3000","http://localhost:3000","https://chatappclient-chiragchavda.onrender.com"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    // socket.to(data).emit("init_msg","Hii there, this is server, enjoy the chat");
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on("typing",(data)=>{
    socket.to(data.room).emit("showType",data);
  })
  socket.on("stopTyping",(data)=>{
    socket.to(data.room).emit("stopType",data);
  })
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});