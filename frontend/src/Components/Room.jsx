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
      <div key={id} className='empty'></div>
    ))
  )
}

function Room() {
  const { room, player_name} = useParams()
  const history = useHistory()

  const [loading, setLoading] = useState(true)
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

  const [mainBoard, setMainBoard] = useState(EmptyBoard())
  const [secondBoard, setSecondBoard] = useState(EmptyBoard())
  useEffect(() => {
    socket.on('board', (data) => {
      console.log('Board recv: ', data)

      let recvBoard = Array.from(data.board, (color, id) => (
        <div key={id} className={color}></div>
      ))

      if (data.socketId === socket.id)
        setMainBoard(recvBoard)
      else
        setSecondBoard(recvBoard)

    })
    return() =>{
      socket.off('board')
    }
  }, [])

  const [ playerSize, setPlayerSize ] = useState(2)
  //use state sur nb player

  //début(reception des names)/fin de la partie 

  if (loading)
    return <p>loading...</p>

	return(
      <div className='room'>
        <h1>{room}</h1>
        { playerSize === 1 ? <LaunchGame/>: null }
        <Board status='mainBoard' board={mainBoard} />
        { playerSize === 2 ?
            <Board status='secondBoard' board={secondBoard} /> : null
        }  
      </div> 
	)
}

export default Room
