'use strict'
import Room from './Room'

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

let rooms = []

//socket
io.on('connection', (socket) => {
  console.log(`Client connected [${socket.id}]`)

  socket.on('join_room', (data, callback) => {
    console.log(`join_room from [${socket.id}]`)

	  rooms.forEach(room => {
      room.logInfo()
  
      const room_status =  room.roomStatus(data.room, data.pseudo)
      switch (room_status) {
        case 'FULL':
          callback({ code: 1, msg: "The room is full." })
          return
        case 'INGAME':
          callback({ code: 1, msg: "You can't join a room in game." })
          return
        case 'SAMEPSEUDO':
          callback({ code: 1, msg: "Pseudo already taken." })
          return
        case 'REACHABLE':
          room.joinRoom(data.pseudo, socket)
          callback({ code: 0, msg: "Succed to join room." })
          return
      }
    })

	  let newRoom = new Room(data.room, data.pseudo, socket)
	  rooms.push(newRoom)//TODO not fp ?
	  callback({ code: 0, msg: "Succed to create room." })
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
