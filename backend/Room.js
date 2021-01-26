class Room{
	constructor(room_name, player_name, host_socket){
		console.log('['+ room_name +']' + ' New room created by ' + player_name + '.')
		this.room_name = room_name
		this.host_name = player_name
    this.host_socket = host_socket
		this.guest_name = player_name
    this.guest_socket = null
    this.player_size = 1
    //this.isRoomActive = to pop unuse room from rooms
	}

	logInfo(){
		console.log('Room['+ this.room_name +']' + ' Host[' + this.host_name + '] Size[' + this.player_size + ']')
  }
  
  joinRoom(player_name, guest_socket){
    console.log('['+ this.room_name +']' + player_name + ' join the room.')
    this.player_size += 1
    this.guest_socket = guest_socket
    this.guest_name = player_name
  }

  roomStatus(room_name, player_name){
    //TODO add is in game INGAME
    if (this.room_name == room_name){
      if (this.player_size == 2)
        return 'FULL'
      else if (this.host_name == player_name)
        return 'SAMEPSEUDO'
      else
        return 'REACHABLE'
    }
    return 'UNKNOWN'
  }
}

export default Room