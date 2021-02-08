import Game from './Game'

class Player{
	constructor(name, socket){
		this.name = name
		this.socket = socket
		this.game = null
	}

	closeGame(){
		this.game = null
	}

	createGame(opponent, room, generator){
		this.game = new Game(this, opponent, room, generator)
	}

}

export default Player
