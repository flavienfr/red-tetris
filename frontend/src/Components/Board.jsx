import { socket } from '../App'
import { useState, useEffect } from 'react'

function Board() {
  let mainBoard = Array.from({length: 200}, (_, id) => (
    <div key={id} className='empty'></div>
  ))
  const [board, setBoard] = useState(mainBoard)

  useEffect(() => {
    socket.on('board', (data) => {
      console.log('Board recv')

      let recvBoard = Array.from(data, (color, id) => (
        <div key={id} className={color}></div>
      ))
      setBoard(recvBoard)
    })
    return() =>{
      socket.off('board')
    }
  }, [])

  return (
    <div className='board'>
      { board }
    </div>
  )

}

export default Board
