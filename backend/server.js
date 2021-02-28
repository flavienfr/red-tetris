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
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
})

let serverManager = new ServerManager()

io.on('connection', (socket) => {
  console.log(`Client connected [${socket.id}]`)

  ServerManager.joinRoom(socket)
  socket.on("disconnect", () => {
    ServerManager.leaveRoom(socket)
  })

  serverManager.joinRoomListener(socket)
})

server.listen(HOST_PORT, function () {
	console.log(`Running on port ${HOST_PORT}`) //pk on 0.0.0.0 et localhost
})
