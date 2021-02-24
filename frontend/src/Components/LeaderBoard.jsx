import { useEffect, useState } from 'react'

function LeaderBoard() {
  const { leaderBoard, setLeaderBoard} = useState('Loading...')

  useEffect(() => {
		socket.emit("leader_board", (data) => {
			console.log('data', data)
  	})
  }, [])
}

export default LeaderBoard
