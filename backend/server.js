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

io.on('connection', (socket) => {
  console.log(`Client connected [${socket.id}]`)

  socket.on('join_room', (data, callback) => {
    let isRoomExist = false

	  rooms.forEach(function(room, index, array){
      console.log('Room['+ room.name +']' + ' Host[' + room.host.name + '] Size[' + room.player_size + ']')
      if (room.status == 'off')
        array.splice(index, 1)
      else {
        const room_status =  room.roomStatus(data.room, data.player_name)
        switch (room_status) {
          case 'FULL':
            callback({ code: 1, msg: "The room is full." })
            isRoomExist = true
            return
          case 'INGAME':
            callback({ code: 1, msg: "You can't join a room in game." })
            isRoomExist = true
            return
          case 'SAMEPSEUDO':
            callback({ code: 1, msg: "Pseudo already taken." })
            isRoomExist = true
            return
          case 'REACHABLE':
            room.joinRoom(data.player_name, socket)
            callback({ code: 0, msg: "Succed to join room." })
            isRoomExist = true
            return
        }
      }
    })

    if (isRoomExist === false){
	    let newRoom = new Room(data.room, data.player_name, socket)
	    rooms.push(newRoom)
      callback({ code: 0, msg: "Succed to create room." })
    }
  })

})

server.listen(HOST_PORT, function () {
	console.log(`Running on port ${HOST_PORT}`) //pk on 0.0.0.0 et localhost
})


/* ************* */
/*
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
};*/
/* ************* */
