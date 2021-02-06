import { io } from './server'

class Game{
  constructor(host, guest){
    this.host = host
    this.guest = guest
    this.status = 'on'

    this.host.socket.join('stream')
    if (this.guest)
      this.guest.socket.join('stream')
    
    //create socket room with 1 or 2 socket
    //init socket listen keys from the host
    this.mainBoard = Array.from({length: 200}, () => ( 'pink' ))
    
    //this.interv = null
  }

  launch(){
    //try to send to multi players
    io.to('stream').emit('board', {
      socketId: this.host.socket.id,
      board: this.mainBoard
    })
    //this.host.socket.emit('board', this.mainBoard)
  }
  
  exit(){
    //clearInterval(this.interv)
  }
}

export default Game
