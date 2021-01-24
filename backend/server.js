'use strict'
const express = require('express')
const cors = require('cors')

const HOST_PORT = 8080

const app = express()
const server = require('http').Server(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", //TODO replace by * ?
    methods: ["GET", "POST", "PUT"]
  }
})

//socket
io.on('connection', (socket) => {
  console.log(`Client connected [${socket.id}]`)

  socket.on('join_room', (data, callback) => {
    console.log(`join_room from [${socket.id}]`)
    console.log(data)
    callback({ code: 0, msg: "Success" })
    //callback({ code: 1, msg: "Pseudo already taken." })
    //callback({ code: 1, msg: "You can't join a room in game." })
    //callback({ code: 1, msg: "The room is full." })
  })
  
})



/* ************* */

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  socket.emit("FromAPI", response);
};
/* ************* */



server.listen(HOST_PORT, function () {
	console.log(`Running on port ${HOST_PORT}`) //pk on 0.0.0.0 et localhost
})
