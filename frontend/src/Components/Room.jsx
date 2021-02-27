import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { socket } from '../App'
import LaunchGame from './LaunchGame.jsx'
import Board from './Board.jsx'
import LeaderBoard from './LeaderBoard.jsx'

function BackToJoinForm(code, msg, player_name, room, history){
	const location = {
		pathname: '/',
		state: { code, msg, player_name, room }
	}
	history.replace(location)	
}

function KeyHandler(e){
  socket.emit('key_input', e.keyCode, e.type)
}

function Room() {
  const { room, player_name} = useParams()
  const history = useHistory()

  useEffect(() => {
    document.addEventListener('keydown', KeyHandler)
    document.addEventListener('keyup', KeyHandler);

    return() => {
      document.removeEventListener('keydown', KeyHandler)
      document.removeEventListener('keyup', KeyHandler)
    }
  }, [])

  const [btnStart, setBtnStart] = useState(true)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    socket.emit("join_room", { player_name, room }, (data) => {
      console.log("join_room", data)
      if (data.code === 0){
        setPlayerSize(data.playerSize)
        setIsHoste(data.isHost)
        setLoading(false)
      }
      else
        BackToJoinForm(data.code, data.msg, player_name, room, history)
  	})
    return () =>{
      socket.emit("leave_room")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, player_name])//TODO redo the bug at the end

  const [ playerSize, setPlayerSize ] = useState(1)
  const [ isHost, setIsHoste ] = useState(true)
  const [ isWinner, setIsWinner ] = useState(null)
  useEffect(()=>{
    socket.on('roomInfo', (data) => {
      console.log('roomINfo:', data)
      setPlayerSize(data.playerSize)
      setIsHoste(data.isHost)
      if (data.reset)
        setBtnStart(data.reset)
      console.log('WINNER', data.iswinner)
      setIsWinner(data.iswinner)
    })
    return() =>{
      socket.off('roomInfo')
    }
  }, [])

  if (loading)
    return <p>loading...</p>
/*
  { isWinner === true ? <p>Winner</p> : null }
  { isWinner === false ? <p>Loser</p> : null }
*/
	return(
      <div className='room'>
        <h1>{room}</h1>

        { isHost ? <LaunchGame 
            btnStart={btnStart} 
            setBtnStart={setBtnStart}
          /> : null 
        }
        <div className='playArea'>
          <Board 
            playerSize= {playerSize}
            isWinner= {isWinner}
          />
          { playerSize === 1 ? <LeaderBoard/> : null }
        </div>
      </div> 
	)
}

export default Room
