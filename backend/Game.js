import { io } from './server'
import PiecesManager from './PiecesManager'
import { SHEMA_SIZE } from './AllPieces'

const NORMAL_SPEED = 500
const FAST_SPEED = 100
const ROWS = 20 
const COLS = 10
const BOARD_SIZE = 200

class Game{
  constructor(host, guest, room, generator){
    this.room = room
    this.host = host
    this.guest = guest
    this.mainBoard = Array.from({length: BOARD_SIZE}, () => ( 'empty' ))
    this.pc = new PiecesManager(generator)

    this.keysListener(this.host.socket)
    this.host.socket.join(this.room.name)
    if (this.guest)
      this.guest.socket.join(this.room.name)
    this.interval = null
    this.speed = NORMAL_SPEED
    this.isNewPiece = true
  }

  emitBoard(){
    io.to(this.room.name).emit('board', {
      socketId: this.host.socket.id,
      board: this.mainBoard
    })
  }

  getSpectrePos(col, row, piece){
    let tmp_row = row
    while (this.isEmptyArea(col, row + 1, piece)){
      ++row
    }
    if(tmp_row == row)
      return null
    return ([col, row]) 
  }

  unDrawPiece(col, row, piece){
    this.drawPiece(col, row, piece, 'empty')
    this.drawPieceSpectre(col, row, piece, 'empty')
  }

  drawPieceSpectre(col, row, piece, color){
    const pos = this.getSpectrePos(col, row, piece)
    if (pos !== null){
      let spectre_color = color
      spectre_color += (color == 'empty' ? '' : ' spectre')
      this.drawPiece(pos[0], pos[1], piece, spectre_color)
    }
    this.drawPiece(col, row, piece, color)
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
        const x_shema = x - col
        const y_shema = y - row
        const box = y * COLS + x

        if (piece[y_shema * SHEMA_SIZE + x_shema] == 1 &&
            ( box < 0 || box >= 200 || x >= 10 || x < 0 ||
            (this.mainBoard[box].indexOf('empty') === -1 &&
            this.mainBoard[box].indexOf('spectre') === -1 &&
            this.mainBoard[box].indexOf('move') === -1)))
          return(false)
      }
    }
    return(true)
  }

  down(){
    const piece =  this.pc.getPiece()
    const color = this.pc.cur_piece_color

    if (!this.isNewPiece)
      this.unDrawPiece(this.pc.cur_x, this.pc.cur_y, piece, 'empty')
    if (this.isEmptyArea(this.pc.cur_x, this.pc.cur_y + 1, piece)){
      this.isNewPiece = false
      this.pc.down()
      this.drawPieceSpectre(this.pc.cur_x, this.pc.cur_y, piece, color + ' move')
      this.emitBoard()
    }
    else{
      this.isNewPiece = true
      this.drawPieceSpectre(this.pc.cur_x, this.pc.cur_y, piece, color)
      this.pc.next()
    }
  }

  downSpeed(SPEED){
    clearInterval(this.interval)
    this.down()
    this.interval = setInterval(() => {
      console.log('GAME['+this.host.name+']: downSpeed')
      this.down()
    }, SPEED)
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

          const rotate_piece = this.pc.getRotate()
          const piece =  this.pc.getPiece()
          const color = this.pc.cur_piece_color

          this.unDrawPiece(this.pc.cur_x, this.pc.cur_y, piece, 'empty')
          if (!this.isNewPiece && this.isEmptyArea(this.pc.cur_x, this.pc.cur_y, rotate_piece)){
            this.pc.rotate()
            this.drawPieceSpectre(this.pc.cur_x, this.pc.cur_y, rotate_piece, color + ' move')
            this.emitBoard()
          }
        }
        else if (key == 40 && lastState.down === 0){
          console.log('down:', key, type)
          lastState.down = 1
          this.downSpeed(FAST_SPEED)
        }
        else if (key == 37 && lastState.left === 0){
          console.log('left:', key, type)
          lastState.left = 1

          const piece =  this.pc.getPiece()
          const color = this.pc.cur_piece_color

          this.unDrawPiece(this.pc.cur_x, this.pc.cur_y, piece, 'empty')
          if (!this.isNewPiece && this.isEmptyArea(this.pc.cur_x - 1, this.pc.cur_y, piece)){
            this.pc.left()
            this.drawPieceSpectre(this.pc.cur_x, this.pc.cur_y, piece, color + ' move')
            this.emitBoard()
          }
        }
        else if (key == 39 && lastState.right === 0){
          console.log('right:', key, type)
          lastState.right = 1

          const piece =  this.pc.getPiece()
          const color = this.pc.cur_piece_color

          this.unDrawPiece(this.pc.cur_x, this.pc.cur_y, piece, 'empty')
          if (!this.isNewPiece && this.isEmptyArea(this.pc.cur_x + 1, this.pc.cur_y, piece)){
            this.pc.right()
            this.drawPieceSpectre(this.pc.cur_x, this.pc.cur_y, piece, color + ' move')
            this.emitBoard()
          }
        }
        else if (key == 32 && lastState.space === 0){
          console.log('space:', key, type)
          lastState.space = 1

          const piece =  this.pc.getPiece()
          const color = this.pc.cur_piece_color
          const next_pos = this.getSpectrePos(this.pc.cur_x, this.pc.cur_y, piece)
          
          this.unDrawPiece(this.pc.cur_x, this.pc.cur_y, piece, 'empty')
          if (!this.isNewPiece && next_pos && this.isEmptyArea(next_pos[0], next_pos[1], piece)){
            if (next_pos){
              this.pc.goTo(next_pos[0], next_pos[1])
              this.drawPieceSpectre(this.pc.cur_x, this.pc.cur_y, piece, color + ' move')
              this.emitBoard()
              
              this.isNewPiece = true
              this.drawPieceSpectre(this.pc.cur_x, this.pc.cur_y, piece, color)
              this.pc.next()
              this.downSpeed(NORMAL_SPEED)
            }
          }

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
          this.downSpeed(NORMAL_SPEED)
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
    this.downSpeed(NORMAL_SPEED)
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
