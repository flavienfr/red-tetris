import Player from './Player'

class Room{
	constructor(room_name, player_name, host_socket){
		console.log('Room['+ room_name +']' + ' New room created by ' + player_name + '.')
		this.room_name = room_name
	    this.host = new Player(player_name, host_socket)
	    this.guest = null
	    this.player_size = 1
	    //this.isRoomActive = to pop unuse room from rooms
      //this.initPlayerSocket()
  }

  logInfo(){
    console.log('Room['+ this.room_name +']' + ' Host[' + this.host.name + '] Size[' + this.player_size + ']')
  }

  /*initPlayer(player_name){
    this.host.socket.on("disconnect", () => {
      console.log('Room['+ this.room_name +'] ' + player.name + ' disconnected')
      //player = null //delete 
      this.player_size -= 1
    })
    return (new Player(player_name, socket))
  }*/
  
  joinRoom(player_name, guest_socket){
    console.log('Room['+ this.room_name +']' + '['+ this.room_name +']' + player_name + ' join the room.')
    this.guest = new Player(player_name, guest_socket)
    this.player_size += 1
  }

  roomStatus(room_name, player_name){
    //TODO add is in game INGAME
    if (this.room_name == room_name){
      if (this.player_size == 2)
        return 'FULL'
      else if (this.host.name == player_name)
        return 'SAMEPSEUDO'
      else
        return 'REACHABLE'
    }
    return 'UNKNOWN'
  }
}

export default Room