import { io } from './server'
import PiecesManager from './PiecesManager'
import { SHEMA_SIZE } from './AllPieces'

const NORMAL_SPEED = 500
const ROWS = 20 
const COLS = 10
const BOARD_SIZE = 200

class Game{
  constructor(host, guest, room, generator){
    this.room = room
    this.host = host
    this.guest = guest
    this.mainBoard = Array.from({length: BOARD_SIZE}, () => ( 'empty' ))
    this.pieces_manager = new PiecesManager(generator)

    this.keysListener(this.host.socket)
    this.host.socket.join(this.room.name)
    if (this.guest)
      this.guest.socket.join(this.room.name)
    this.interval = null
    this.speed = NORMAL_SPEED
  }

  emitBoard(){
    io.to(this.room.name).emit('board', {
      socketId: this.host.socket.id,
      board: this.mainBoard
    })
  }

  drawPiece(col, row, piece, color){
    for(let y = row; y < (row + SHEMA_SIZE); ++y){
      for(let x = col; x < (col + SHEMA_SIZE); ++x){
        const x_shema = x -col
        const y_shema = y - row
        if (piece[y_shema * SHEMA_SIZE + x_shema] === 1)
          this.mainBoard[y * COLS + x] = color
      }
    }
  }

  isEmptyArea(col, row, piece){
    for(let y = row; y < (row + SHEMA_SIZE); ++y){
      for(let x = col; x < (col + SHEMA_SIZE); ++x){
        const x_shema = x -col
        const y_shema = y - row
        const box = y * COLS + x

        if (piece[y_shema * SHEMA_SIZE + x_shema] == 1 &&
            ( box < 0 || box >= 200 ||
            this.mainBoard[y * COLS + x].indexOf('empty') === -1))
          return(false)
      }
    }
    return(true)
  }

  downSpeedNormal(){
    this.interval = setInterval(() => {
      console.log('GAME['+this.host.name+']: DownSpeedNormal')
      const piece_x = this.pieces_manager.cur_x
      const piece_y = this.pieces_manager.cur_y
      const last_piece_x = this.pieces_manager.last_x
      const last_piece_y = this.pieces_manager.last_y
      const piece =  this.pieces_manager.getPiece()

      this.drawPiece(last_piece_x, last_piece_y, piece, 'empty')
      if (this.isEmptyArea(piece_x, piece_y + 1, piece)){
        this.pieces_manager.down()
        this.drawPiece(piece_x, piece_y, piece, 'green')
      }
      else{
        //si bloque delay
        this.drawPiece(piece_x, piece_y, piece, 'green')
        this.pieces_manager.next()
      }
      this.emitBoard()

    }, NORMAL_SPEED)
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


          const piece_x = this.pieces_manager.cur_x
          const piece_y = this.pieces_manager.cur_y
          const last_piece_x = this.pieces_manager.last_x
          const last_piece_y = this.pieces_manager.last_y
          const piece =  this.pieces_manager.getPiece()
          this.drawPiece(last_piece_x, last_piece_y, piece, 'empty')
          if (this.isEmptyArea(piece_x - 1, piece_y, piece)){
            this.pieces_manager.left()
            this.drawPiece(piece_x, piece_y, piece, 'green')
          }
          else{
            //si bloque delay
            this.drawPiece(piece_x, piece_y, piece, 'green')
          }
          this.emitBoard()
          

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

  launch(){
    this.downSpeedNormal()
  }
  
  exit(){
    console.log('Room['+this.room.name+'] Player['+this.host.name+'] quit')
    this.mainBoard = Array.from({length: BOARD_SIZE}, () => ( 'empty' ))
    this.emitBoard()

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
