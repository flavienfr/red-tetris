import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'

import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { socket } from '../App'

function JoinForm(){
  const [player_name, setPlayer_name] = useState("")
  const [room, setRoom] = useState("")
  const [alertMsg, setAlertMsg] = useState(null)
  let history = useHistory()

  function handleSubmit(e){
    e.preventDefault();
    //loading
  
    socket.emit("join_room", { player_name, room }, (data) => {
      console.log(data.msg)
      if (data.code === 0){
       // console.log('cici', data.code, data.msg)
        history.push('/' + room + '[' + player_name + ']')
      }
      else{
        setAlertMsg(data.msg)
        //console.log('lyul', data.code, data.msg)
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
        <Form.Label>player_name</Form.Label>
        <Form.Control 
          value={player_name}
          onChange={ (e) => (setPlayer_name(e.target.value)) }
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