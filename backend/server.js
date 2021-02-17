'use strict'
import Room from './Room'

const HOST_PORT = 8080

const express = require('express')
const cors = require('cors')
const mongodb = require('./db/mongo')//dbdb

mongodb.initClientDbConnection();//dbdb

const app = express()
const server = require('http').Server(app)

export const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", //TODO replace by * ? "http://localhost:3000"
    methods: ["GET", "POST", "PUT"]
  }
})

/* Sandbox  */
/*async function test(){
  const value = await leaderBoard.findOne({ name: 'toto' }).exec() //await .exec();
  console.log('value', value)
}*/

const leaderBoard = require('./models/leaderBoard')//dbdb

const score = new leaderBoard({
	name: 'toto',
	score: 0,
})

//test()

/*

score.save(function (err) {
	if (err) return console.log(err)
	console.log('saved!')
})*/
/************/

let rooms = []

io.on('connection', (socket) => {
  console.log(`Client connected [${socket.id}]`)

  socket.on('join_room', (data, callback) => {
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
  })

})

server.listen(HOST_PORT, function () {
	console.log(`Running on port ${HOST_PORT}`) //pk on 0.0.0.0 et localhost
})
