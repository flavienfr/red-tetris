'use strict'
import ServerManager from './ServerManager'

const HOST_PORT = 8080

const express = require('express')
const cors = require('cors')
const mongodb = require('./db/mongo')//dbdb

mongodb.initClientDbConnection();//dbdb

const app = express()
const server = require('http').Server(app)

export const io = require("socket.io")(server, {
  cors: {
    origin: "*", //TODO replace by * ? "http://localhost:3000"
    methods: ["GET", "POST", "PUT"]
  }
})

let serverManager = new ServerManager()

io.on('connection', (socket) => {
  console.log(`Client connected [${socket.id}]`)

  /*********/ 
  ServerManager.joinRoom(socket)
  ServerManager.emitLeaderBoard(socket)
  socket.on("disconnect", () => {
    ServerManager.leaveRoom(socket)
  })
  
  /*********/

  serverManager.joinRoomListener(socket)
  /*socket.on('join_room', (data, callback) => {
    let isRoomExist = false

	  rooms.forEach(function(room, index, array){
      //console.log('Room['+ room.name +']' + ' Host[' + room.host.name + '] Size[' + room.player_size + ']')
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
            callback({
              code: 0, msg: "Succed to join room.",
              playerSize: room.player_size,
              isHost: false,
              reset: null
            })
            isRoomExist = true
            return
        }
      }
    })

    if (isRoomExist === false){
	    let newRoom = new Room(data.room, data.player_name, socket)
	    rooms.push(newRoom)
      callback({ code: 0, msg: "Succed to create room.",
        playerSize: newRoom.player_size,
        isHost: true,
        reset: null
      })
    }
  })*/

})

server.listen(HOST_PORT, function () {
	console.log(`Running on port ${HOST_PORT}`) //pk on 0.0.0.0 et localhost
})
