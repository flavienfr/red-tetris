import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'

import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

function JoinForm(){
  const history = useHistory()
  const location = useLocation()

  const [player_name, setPlayer_name] = useState("")
  const [room, setRoom] = useState("")
  const [alertMsg, setAlertMsg] = useState(null)
  useEffect( () => {
    if (location.state !== undefined){
      setPlayer_name(location.state.player_name)
      setRoom(location.state.room)
      if (location.state.code !== 0)
        setAlertMsg(location.state.msg)
    }
  }, [location.state])

  function handleSubmit(e){
    e.preventDefault();
    history.push('/' + room + '[' + player_name + ']')
  }
  
  return(
    <>
    <h1>RED TETRIS</h1>
    <Form onSubmit={handleSubmit}>
      { alertMsg && 
        <Alert  variant='danger'>
          {alertMsg}
        </Alert>
      }
      <Form.Group>
        <Form.Label>Pseudo</Form.Label>
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
    </>
  )
}

export default JoinForm
