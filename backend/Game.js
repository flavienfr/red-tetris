import { io } from './server'

class Game{
  constructor(host, guest, room, generator){
    this.room= room
    this.host = host
    this.guest = guest
    this.mainBoard = Array.from({length: 200}, () => ( 'pink' ))
    this.generator = generator
    this.current_piece = null

    this.host.socket.join(this.room.name)
    if (this.guest)
      this.guest.socket.join(this.room.name)
    //init socket listen keys from the host
  }

  launch(){
    io.to(this.room.name).emit('board', {
      socketId: this.host.socket.id,
      board: this.mainBoard
    })
  }
  
  exit(){
    //console.log('rooms: ', this.host.socket.rooms)
    console.log('Room['+this.room.name+'] Player['+this.host.name+'] quit')
    this.host.socket.leave(this.room.name)
    this.host.closeGame()
    this.guest = null
    this.room = null

    //this.status = 'off'
    //demonter room socket 
    //clearInterval(this.interv)
  }
}

export default Game
