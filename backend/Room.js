import Player from './Player'
import Game from './Game'

class Room{
	constructor(room_name, player_name, host_socket){
		console.log('Room['+ room_name +']' + ' New room created by ' + player_name + '.')
    this.name = room_name
    this.status = 'on'
	  this.host = new Player(player_name, host_socket)
	  this.guest = null
	  this.host_game = null
	  this.guest_game = null
    this.player_size = 1
    this.listenLeaveRoom(this.host)
    this.listenLaunchGame(this.host)
  }

  emitResetBoard(){
    const game = this.host.game_host
    //if (game && game.status)
  }

  quitRoomEnvent(player){
    if (this.player_size == 2){
      if(this.host.socket.id === player.socket.id){
        /**** */
        this.host.socket.removeAllListeners('launch_game')
        if (this.game_host){
          this.game_host.exit()
          this.game_host = null
        }
        if (this.game_guest){
          this.game_guest.exit()
          this.game_guest = null
        }
        /**** */
        this.host = this.guest
        this.guest = null
        this.listenLaunchGame(this.host)
        //emitPlayerReSize + game status (you win + reset)
        console.log('Room['+ this.name +'] ' + this.host.name + ' is the new host')
      }
      else{
        //emitPlayerReSize + game status (you win + reset)
        /**** */
        if (this.game_host){
          this.game_host.exit()
          this.game_host = null
        }
        if (this.game_guest){
          this.game_guest.exit()
          this.game_guest = null
        }
        /**** */
        this.guest = null
        console.log('Room['+ this.name +'] player left the room.')
      }
    }
    else{
      console.log('Room['+ this.name +'] room close.')
      this.status = 'off'

      //Mettre partout list of all event except join_room, et disconect
      this.host.socket.removeAllListeners('launch_game')
      if (this.game_host){
        this.game_host.exit()
        this.game_host = null
      }
      if (this.game_guest){
        this.game_guest.exit()
        this.game_guest = null
      }
      //**************************** */
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
    console.log("   (tmp log) => room_name", room_name, "this.name", this.name)
    if (this.name == room_name){
      if (this.player_size == 2)
        return 'FULL'
      else if (this.host.name == player_name)
        return 'SAMEPSEUDO'
      else if (this.game_host && this.game_host.status === 'on')
        return 'INGAME'
      else
        return 'REACHABLE'
    }
    return 'UNKNOWN'
  }

  listenLaunchGame(player){
    player.socket.on("launch_game", (data, callback) => {
      console.log('Room['+ this.name +'] ' + this.player_size + ' player(s) game launch')
      
      //TODO some check before
      if (this.game_host && this.game_host.status == 'on')
        return (callback({ code: 1, msg: "The room is in game." }))

      callback({ code: 0, msg: "Succed to create room." })
      this.host_game = new Game(this.host, this.guest)
      this.host_game.launch()
  
      //if (this.guest){
      //  this.guest_game = new Game(this.guest, this.host)
      //  this.guest_game.launch()
      //}
  
    })
  }
}

export default Room
