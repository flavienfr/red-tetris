import { io } from './server'
import PiecesManager from './PiecesManager'

const NORMAL_SPEED = 500
const ROWS = 20 
const COLS = 10

class Game{
  constructor(host, guest, room, generator){
    this.room= room
    this.host = host
    this.guest = guest
    this.mainBoard = Array.from({length: 200}, () => ( 'pink' ))
    this.pieces_manager = new PiecesManager(generator)

    this.keysListener(this.host.socket)
    this.host.socket.join(this.room.name)
    if (this.guest)
      this.guest.socket.join(this.room.name)
    this.interval = null
  }

  //emitBoard

  //UndrawPiece

  //DrawPiece

  IsEmptyArea(row, col, piece, size){
    for(y = row; y < (row + size); ++y){
      for(x = col; x < (col + size); ++x){
        const top_left = y * COLS + x
        const bottom_right = (y + size - 1) * COLS + (x + size - 1)
        if (top_left < 0 || top_left >= 200 ||
            bottom_right < 0 || bottom_right >= 200)
          return false
        const x_shema = x -col
        const y_shema = y - row
        if (piece[y_shema * size + x_shema] == 1 &&
            this.mainBoard[y * COLS + x].indexOf('empty') === -1)
          return(false)
      }
    }
    return(true)
  }

  keysListener(socket){
    //TODO: copy past into the front for opti
    let lastState = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      space: 0,
    }

    socket.on('key_input', (key, type) => {
      if (type === 'keydown'){
        if (key == 38 && lastState.up === 0){
          console.log('up:', key, type)
          lastState.up = 1
        }
        else if (key == 40 && lastState.down === 0){
          console.log('down:', key, type)
          lastState.down = 1
        }
        else if (key == 37 && lastState.left === 0){
          console.log('left:', key, type)
          lastState.left = 1

        }
        else if (key == 39 && lastState.right === 0){
          console.log('right:', key, type)
          lastState.right = 1
        }
        else if (key == 32 && lastState.space === 0){
          console.log('space:', key, type)
          lastState.space = 1
        }
      }
      else if (type === 'keyup'){
        if (key == 38){
          console.log('up:', key, type)
          lastState.up = 0
        }
        else if (key == 40){
          console.log('down:', key, type)
          lastState.down = 0
        }
        else if (key == 37){
          console.log('left:', key, type)
          lastState.left = 0

        }
        else if (key == 39){
          console.log('right:', key, type)
          lastState.right = 0
        }
        else if (key == 32){
          console.log('space:', key, type)
          lastState.space = 0
        }
      }
      
      
    })
  }

  DownSpeedNormal(){
    this.interval = setInterval(() => {
      console.log('DownSpeedNormal')
    }, NORMAL_SPEED)
  }

  launch(){
    io.to(this.room.name).emit('board', {
      socketId: this.host.socket.id,
      board: this.mainBoard
    })
    this.DownSpeedNormal()
  }
  
  exit(){
    //console.log('rooms: ', this.host.socket.rooms)
    console.log('Room['+this.room.name+'] Player['+this.host.name+'] quit')
    this.host.socket.removeAllListeners("key_input")
    this.host.socket.leave(this.room.name)
    this.host.closeGame()
    this.guest = null
    this.room = null

    clearInterval(this.interval)
    //this.status = 'off'
    //demonter room socket 
  }
}

export default Game
