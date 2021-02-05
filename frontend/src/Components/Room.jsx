import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { socket } from '../App'
import Game from './Game.jsx'

function BackToJoinForm(code, msg, player_name, room, history){
	const location = {
		pathname: '/',
		state: { code, msg, player_name, room }
	}
	history.replace(location)	
}

function Room() {
  const [loading, setLoading] = useState(true)
  const { room, player_name} = useParams()
  const history = useHistory()

  useEffect(() => {
    socket.emit("join_room", { player_name, room }, (data) => {
      console.log(data)
      if (data.code === 0)
        setLoading(false)
      else
        BackToJoinForm(data.code, data.msg, player_name, room, history)
  	})
    return () =>{
      socket.emit("leave_room")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading)
    return <p>loading...</p>

	return(
      <div>
        <p>Game component</p>
        <p>Room: {room}</p>
        <p>Player: {player_name}</p>
        <Game/>
      </div> 
	)
}

export default Room
