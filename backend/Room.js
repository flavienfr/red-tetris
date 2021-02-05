import Player from './Player'

class Room{
	constructor(room_name, player_name, host_socket){
		console.log('Room['+ room_name +']' + ' New room created by ' + player_name + '.')
    this.name = room_name
    this.status = 'on'
	  this.host = new Player(player_name, host_socket)
	  this.guest = null
	  this.game = null
    this.player_size = 1
    this.listenLeaveRoom(this.host)
  }

  quitRoomEnvent(player){
    if (this.player_size == 2){
      if(this.host.socket.id === player.socket.id){
        this.host = this.guest
        this.guest = null
        console.log('Room['+ this.name +'] ' + this.host.name + ' is the new host')
      }
      else{
        this.guest = null
        console.log('Room['+ this.name +'] player left the room.')
      }
    }
    else{
      console.log('Room['+ this.name +'] room close.')
      this.status = 'off'
    }
    this.player_size -= 1
  }

  listenLeaveRoom(player){
    player.socket.once("disconnect", () => {
      console.log('Room['+ this.name +'] ' + player.name + ' disconnect from the room.')
      player.socket.removeAllListeners("leave_room")//TODO ? pour garbage collector ?
      this.quitRoomEnvent(player)
    })

    player.socket.once("leave_room", () => {
      console.log('Room['+ this.name +'] ' + player.name + ' leave the room.')
      player.socket.removeAllListeners("disconnect")
      this.quitRoomEnvent(player)
    })
  }

  joinRoom(player_name, guest_socket){
    console.log('Room['+ this.name +'] ' + player_name + ' join the room.')
    this.guest = new Player(player_name, guest_socket)
    this.player_size += 1
    this.listenLeaveRoom(this.guest)
  }

  roomStatus(room_name, player_name){
    console.log("room_name", room_name, "this.name", this.name)
    if (this.name == room_name){
      if (this.player_size == 2)
        return 'FULL'
      else if (this.host.name == player_name)
        return 'SAMEPSEUDO'
      else if (this.game && this.game.status === 'on')
        return 'INGAME'
      else
        return 'REACHABLE'
    }
    return 'UNKNOWN'
  }

  launchGame(){
    player.socket.on("launch_game", () => {
      console.log('Room['+ this.name +'] ' + this.player_size + ' player(s) game launch')
      //TODO some check before
      this.game = new Game(this.host, this.guest)
    })
  }
}

export default Room