import { useEffect, useState } from 'react'
import { socket } from '../App'


function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState('Loading...')

  useEffect(() => {
    socket.on("leader_board", (data) => {
      console.log('leader_board', data)
      let recvBoard = Array.from(data, (row, id) => (
        <p key={id} >{row.name} / {row.score}</p>
      ))
      setLeaderBoard(recvBoard)
    })
    return () =>{
      socket.off('leader_board')
    }
  }, [])

  return(
    <div className='leaderboard'>
      <p>name     score</p>
      {leaderBoard}
    </div>
  )
}

export default LeaderBoard
