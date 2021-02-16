import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { socket } from '../App'
import LaunchGame from './LaunchGame.jsx'
import Board from './Board.jsx'

function BackToJoinForm(code, msg, player_name, room, history){
	const location = {
		pathname: '/',
		state: { code, msg, player_name, room }
	}
	history.replace(location)	
}

function EmptyBoard(){
  return (
    Array.from({length: 200}, (_, id) => (
      <div key={id} id={ '_' + id } className='empty'></div>
    ))
  )
}

function KeyHandler(e){
  console.log('key_input:', e.keyCode, e.type)
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

  const [mainBoard, setMainBoard] = useState(EmptyBoard())
  const [secondBoard, setSecondBoard] = useState(EmptyBoard())
  const [mainScore, setMainScore] = useState(0)
  const [secondScore, setSecondScore] = useState(0)
  useEffect(() => {
    socket.on('board', (data) => {
      //console.log('Board recv: ', data)
      let recvBoard = Array.from(data.board, (color, id) => (
        <div key={id} id={ '_' + id } className={color}></div>
      ))
      if (data.socketId === socket.id){
        setMainBoard(recvBoard)
        setMainScore(data.score)
      }
      else{
        setSecondBoard(recvBoard)
        setSecondScore(data.score)
      }
    })
    return() =>{
      socket.off('board')
    }
  }, [])

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

	return(
      <div className='room'>
        <h1>{room}</h1>
        { isWinner === true ? <p>Winner</p> : null }
        { isWinner === false ? <p>Loser</p> : null }

        { isHost ? <LaunchGame 
            btnStart={btnStart} 
            setBtnStart={setBtnStart}
          /> : null 
        }
        <Board status='mainBoard' board={mainBoard} />
        <p>{mainScore}</p>
        { playerSize === 2 ?
          <p>{secondScore}</p> : null
        }
        { playerSize === 2 ?
          <Board status='secondBoard' board={secondBoard} /> : null
        }  
      </div> 
	)
}

export default Room
