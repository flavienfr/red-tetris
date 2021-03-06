import Player from './Player'
import {ldBoard} from './models/leaderBoard'
import PiecesGenerator from './PiecesGenerator'
import ServerManager from './ServerManager'

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
    ServerManager.emitLeaderBoard()
  }

  emitRoomInfo_2(player, ishost, reset, iswinner){
    player.socket.emit('roomInfo', {
      playerSize: this.player_size,
      isHost: ishost,
      reset: reset,
      iswinner: iswinner
    })
  }

  removeGame(removeHostLauncher){
    console.log('removeGame from remove')
    if (removeHostLauncher)
      this.host.socket.removeAllListeners('launch_game')
    if (this.host && this.host.game)
      this.host.game.exit()
    if (this.guest && this.guest.game)
      this.guest.game.exit()
  }

  endGame(winner, loser){
    console.log('end game')
    console.log('loser.name',loser.name ,'this.host.name',this.host.name)
    if (this.player_size === 2){
      if (loser.name === this.host.name){
        this.removeGame(true)
        const tmp_guest = this.host
        this.host = this.guest
        this.guest = tmp_guest
        this.listenLaunchGame(this.host)
      }
      else
        this.removeGame(false)
      this.emitRoomInfo_2(this.host, true, true, true)
      this.emitRoomInfo_2(this.guest, false, true, false)
    }
    else{
      const score = new ldBoard({
      	name: this.host.name,
      	score: this.host.game.score,
      })
      score.makeItSave()

      this.removeGame(false)
      this.emitRoomInfo_2(this.host, true, true, false)

    }
    //emit layer / winner info
  }

  quitRoomEnvent(player){
    const player_size_save = this.player_size
    this.player_size -= 1
  
    if (player_size_save == 2){
      if(this.host.socket.id === player.socket.id){
        if (this.guest.game && this.guest.game.status === 'on')
          this.emitRoomInfo_2(this.guest, true, true, true)
        else
          this.emitRoomInfo_2(this.guest, true, true, null)
        this.removeGame(true)
        this.host = this.guest
        this.guest = null
        this.listenLaunchGame(this.host)
        console.log('Room['+ this.name +'] ' + this.host.name + ' is the new host')
      }
      else{
        if (this.guest.game && this.guest.game.status === 'on')
          this.emitRoomInfo_2(this.host, true, true, true)
        else
          this.emitRoomInfo_2(this.host, true, true, null)
        this.removeGame(false)
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
    this.emitRoomInfo_2(this.host, true, true, null)
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

      const generator = new PiecesGenerator()

      this.emitRoomInfo_2(this.host, true, false, null)
      this.host.createGame(this.guest, this, generator)
      if (this.guest){
        this.emitRoomInfo_2(this.guest, false, false, null)
        this.guest.createGame(this.host, this, generator)
      }  
      this.host.game.launch()
      this.guest ? this.guest.game.launch() : null
    })
  }
}

export default Room
