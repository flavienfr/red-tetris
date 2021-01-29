import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { socket } from '../App'

function Game(){
  const [btnStart, setBtnStart] = useState(true)

  function handleStartGame(){
    console.log('handleStartGame')

    socket.emit('launch_game', {}, (data) => {
      console.log(data)
	  })
    
    setBtnStart(false)
  }

	return (
		<div className='GameArea'>
      {btnStart ? 
        <Button variant="success" type="button" onClick={handleStartGame}>START</Button>:
        <Button variant="success" type="button" disabled>START</Button>
      }
      
		</div>
	)
}
export default Game