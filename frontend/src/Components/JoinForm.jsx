import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useState, useContext } from 'react'


import { useHistory } from 'react-router-dom'
import { GlobalContext } from '../App'

function JoinForm(){
  const [pseudo, setPseudo] = useState("")
  const [room, setRoom] = useState("")
  const { test } = useContext(GlobalContext)
  let history = useHistory()

  function handleSubmit(e){
    e.preventDefault();
    //loading
    /*socket.emit("join_room", { pseudo, room }, (data) => {
      if (data.code === 0){
        console.log("good: ", data.msg)
        //history.push("/tot[fsd]")
      }
      else{
        console.log("bad: ", data.msg)
      }
    })*/
  }

  return(
    <Form onSubmit={handleSubmit}>
      <p>test: { test }</p>
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