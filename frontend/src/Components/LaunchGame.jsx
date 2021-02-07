import Button from 'react-bootstrap/Button'
import { socket } from '../App'

function Game({btnStart, setBtnStart}){
  function handleStartGame(){
    console.log('handleStartGame')

    socket.emit('launch_game', {}, (data) => {
      if (data.code === 0)
        setBtnStart(false)
      else
        console.log(data)
	  })
  }

	return (
		<div>
      {
        btnStart ? 
          <Button variant="success" type="button" onClick={handleStartGame}>START</Button>
        :
          <Button variant="success" type="button" disabled>START</Button>
      }
		</div>
	)
}
export default Game