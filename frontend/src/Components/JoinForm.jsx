import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import { useState, useContext } from 'react'

import { useHistory } from 'react-router-dom'
import { GlobalContext } from '../App.js'

function JoinForm(){
  const [pseudo, setPseudo] = useState("")
  const [room, setRoom] = useState("")
  const [alertMsg, setAlertMsg] = useState(null)
  const { socket } = useContext(GlobalContext)
  let history = useHistory()

  function handleSubmit(e){
    e.preventDefault();
    //loading
    socket.emit("join_room", { pseudo, room }, (data) => {
      console.log(data.msg)
      if (data.code === 0){
        history.push('/' + room + '[' + pseudo + ']')
      }
      else{
        setAlertMsg(data.msg)
      }
    })
  }
  
  return(
    <Form onSubmit={handleSubmit}>
      { alertMsg && 
        <Alert  variant='danger'>
          {alertMsg}
        </Alert>
      }
      <Form.Group>
        <Form.Label>Pseudo</Form.Label>
        <Form.Control 
          value={pseudo}
          onChange={ (e) => (setPseudo(e.target.value)) }
          type="text"
          placeholder="Enter pseudo"
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Room</Form.Label>
        <Form.Control
          value={room}
          onChange={ (e) => (setRoom(e.target.value)) }
          type="text"
          placeholder="Room name"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Join
      </Button>
    </Form>
  )
}

export default JoinForm