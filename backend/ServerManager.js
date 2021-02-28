import {ldBoard} from './models/leaderBoard'
import Room from './Room'
import { io } from './server'
import { FormValidation } from './Utils'

class ServerManager{

  constructor(){
    this.rooms = []
  }

  static joinRoom(socket){
    console.log('joinRoom id:',socket.id)
    socket.join('ClientManager')
  }

  static leaveRoom(socket){
    console.log('leaveRoom id:',socket.id)
    socket.leave('ClientManager')
  }
  
  static async emitLeaderBoard(){
    const board = await ldBoard.find()

    io.to('ClientManager').emit('leader_board', (board))
  }

  joinRoomListener(socket){
    socket.on('join_room', (data, callback) => {
      let isRoomExist = false
  
      this.rooms.forEach(function(room, index, array){
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
        let res = FormValidation(data.player_name, data.room)
        if (res !== null){
          callback({ code: 1, msg: res,
            playerSize: null,
            isHost: null,
            reset: null
          })
          return
        }
        let newRoom = new Room(data.room, data.player_name, socket)
        this.rooms.push(newRoom)
        callback({ code: 0, msg: "Succed to create room.",
          playerSize: newRoom.player_size,
          isHost: true,
          reset: null
        })
      }
    })
  }
}

export default ServerManager
