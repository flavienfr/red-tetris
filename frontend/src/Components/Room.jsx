import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { socket } from '../App'
import Game from './Game.jsx'

function Room() {
  const [loading, setLoading] = useState(true)
  const { room, player_name} = useParams()
  const history = useHistory()

  useEffect(() => {
    socket.emit("join_room", { player_name, room }, (data) => {
      console.log(data)
      if (data.code === 0)
        setLoading(false)
      else{
        const location = {
          pathname: '/',
          state: { code: data.code, msg: data.msg, player_name, room }
        }
        history.replace(location)
      }
	})
    return () =>{
      console.log("leave_room")
      socket.emit("leave_room")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

	return(
	  <>{
      loading ? <p>loading component</p> : 
      <div>
        <p>Game component</p>
        <p>Room: {room}</p>
        <p>Player: {player_name}</p>
		<Game/>
      </div> 
	  }</>
	)
}

export default Room
