import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { FormValidation } from './Utils'

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
    let res = FormValidation(player_name, room)
    res === null ? history.push('/' + room + '[' + player_name + ']') : 
    setAlertMsg(res)
  }
  
  return(
    <>
      <div className='login'>
        <h1>RED<br/>TETRIS</h1>
        <div className='loginForm'>
          <Form onSubmit={handleSubmit}>
            { alertMsg && 
              <Alert  variant='danger'>
                {alertMsg}
              </Alert>
            }
            <Form.Group>
              <Form.Control 
                value={player_name}
                onChange={ (e) => (setPlayer_name(e.target.value)) }
                type="text"
                placeholder="Pseudo"
                required
              />
            </Form.Group>
            <Form.Group>
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
        </div>
      </div>
    </>
  )
}

export default JoinForm
