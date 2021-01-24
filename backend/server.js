'use strict'

/*
 to implement: Player, Piece and Game classes
*/

const express = require('express')
const cors = require('cors')

const HOST_PORT = 8080

const app = express()
app.use(cors())

// socket.io
const server = require('http').Server(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", //TODO replace by * ?
    methods: ["GET", "POST", "PUT"]
  }
})

//socket
io.on('connection', (socket) =>{
  console.log(`Client connected [${socket.id}]`)
})


/* main */

io.on('join_create_room', (socket) =>{
  console.log(`Client join or create room [${socket.id}]`)
  //check if room existe or create it
})


/******/

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
