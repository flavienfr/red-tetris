import Player from './Player'

class Room{
	constructor(room_name, player_name, host_socket){
		console.log('Room['+ room_name +']' + ' New room created by ' + player_name + '.')
    this.name = room_name
    this.status = 'on'
	  this.host = new Player(player_name, host_socket)
	  this.guest = null
    this.player_size = 1
    this.listenLeaveRoom(this.host)
	  //this.isRoomActive = to pop unuse room from rooms
    //this.initPlayerSocket()
  }

  listenLeaveRoom(player){
    player.socket.once("leave_room", () => {
      console.log('Room['+ this.name +'] ' + player.name + ' leave room.')
      if (this.player_size == 2){
        console.log("changment d'host")
        this.host = this.guest
        this.guest = null
      }
      else
        this.status = 'off'
      this.player_size -= 1
    })
  }
  
  joinRoom(player_name, guest_socket){
    console.log('Room['+ this.name +']' + ' Host' + '['+ this.name +'] ' + player_name + ' join the room.')
    this.guest = new Player(player_name, guest_socket)
    this.player_size += 1
  }

  roomStatus(room_name, player_name){
    //TODO add is in game INGAME
    if (this.name == room_name){
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