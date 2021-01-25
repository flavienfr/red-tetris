import { useParams } from 'react-router-dom'

function Room() {
	let { room, player_name} = useParams()
	return(
	  <>
		<p>Room: {room}</p>
		<p>Player: {player_name}</p>
	  </>
	)
  }
export default Room
