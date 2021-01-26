import { useParams } from 'react-router-dom'
import { socket } from '../App'

function Room() {
  let { room, player_name} = useParams()

  socket.emit("join_room", { player_name, room }, (data) => {
    console.log(data.msg)
    if (data.code === 0){
      console.log('icici', data.code, data.msg)
    }
    else{
      console.log('lalala', data.code, data.msg)
    }
  })
  console.log('je suis ici')

	return(
	  <>
		<p>Room: {room}</p>
		<p>Player: {player_name}</p>
	  </>
	)
  }

export default Room
