import { io } from './server'

class Game{
  constructor(host, guest, room_name){
    this.room_name = room_name
    this.host = host
    this.guest = guest
    this.status = 'on'

    this.host.socket.join(this.room_name)
    if (this.guest)
      this.guest.socket.join(this.room_name)
    
    //init socket listen keys from the host
    this.mainBoard = Array.from({length: 200}, () => ( 'pink' ))

    //this.currentPiece = {
    //  type
    //}
    
    //this.interv = null
  }

  launch(){
    //try to send to multi players
    io.to(this.room_name).emit('board', {
      socketId: this.host.socket.id,
      board: this.mainBoard
    })
    //this.host.socket.emit('board', this.mainBoard)
  }
  
  exit(){
    //console.log('rooms: ', this.host.socket.rooms)
    console.log('Room['+this.room_name+'] '+this.host.name+'\'s Game exited')
    this.host.socket.leave(this.room_name)
    //this.status = 'off'
    //demonter room socket 
    //clearInterval(this.interv)
  }
}

export default Game
