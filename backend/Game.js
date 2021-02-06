class Game{
  constructor(host, guest){
    this.host = host
    this.guest = guest
    
    //create socket room with 1 or 2 socket
    //init socket listen keys from the host
    this.mainBoard = Array.from({length: 200}, () => ( 'pink' ))
    
    //this.interv = null
  }

  launch(){
    //try to send to multi players
    this.host.socket.emit('board', this.mainBoard)
  }
  
  exit(){
    //clearInterval(this.interv)
  }
}

export default Game
