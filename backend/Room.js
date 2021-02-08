import Player from './Player'
import Game from './Game'
import PiecesGenerator from './PiecesGenerator'

class Room{
	constructor(room_name, player_name, host_socket){
		console.log('Room['+ room_name +']' + ' New room created by ' + player_name + '.')
    this.name = room_name
    this.status = 'on'
	  this.host = new Player(player_name, host_socket)
	  this.guest = null
    this.player_size = 1
    this.listenLeaveRoom(this.host)
    this.listenLaunchGame(this.host)
  }

  emitRoomInfo(){
    this.host.socket.emit('roomInfo', {
      playerSize: this.player_size,
      isHost: true,
      reset: true
    })
  }

  removeGame(removeLaunchGame){
    if (removeLaunchGame)
      this.host.socket.removeAllListeners('launch_game')
    if (this.host && this.host.game)
      this.host.game.exit()//send reset board (+winner on board (: )
    if (this.guest && this.guest.game)
      this.guest.game.exit()//send reset board (+winner on board (: )
  }

  quitRoomEnvent(player){
    const player_size_save = this.player_size
    this.player_size -= 1
  
    if (player_size_save == 2){
      if(this.host.socket.id === player.socket.id){
        this.removeGame(true)
        this.host = this.guest
        this.guest = null
        this.listenLaunchGame(this.host)
        this.emitRoomInfo()
        console.log('Room['+ this.name +'] ' + this.host.name + ' is the new host')
      }
      else{
        this.removeGame(false)
        this.emitRoomInfo()
        this.guest = null
        console.log('Room['+ this.name +'] the guest left the room.')
      }
    }
    else{
      console.log('Room['+ this.name +'] room close.')
      this.removeGame(true)
      this.status = 'off'
    }
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
    this.emitRoomInfo()
    this.listenLeaveRoom(this.guest)
  }

  roomStatus(room_name, player_name){
    if (this.name == room_name){
      if (this.player_size == 2)
        return 'FULL'
      else if (this.host.name == player_name)
        return 'SAMEPSEUDO'
      else if (this.host.game)
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
      if (this.host.game)
        return (callback({ code: 1, msg: "The room is in game." }))
      callback({ code: 0, msg: "Succed to create room." })

      //generator de piece
      const generator = new PiecesGenerator()

      this.host.createGame(this.guest, this, generator)
      if (this.guest)
        this.guest.createGame(this.host, this, generator)
  
      this.host.game.launch()
      //this.guest ? this.guest.game.launch() : null
    })
  }
}

export default Room
