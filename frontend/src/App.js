//import { useState, useEffect } from 'react'
import logo from './logo.svg'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import JoinForm from './Components/JoinForm.jsx'

const io = require("socket.io-client")

const apiUrl = `http://localhost:8080`//TODO globalvariable
const socket = io(apiUrl)
/*
function ClockServerComponent() {
  const [response, setResponse] = useState("")
  useEffect(() => {
    socket.on("FromAPI", data => {
      setResponse(data)
    })
    return () => socket.disconnect()
  }, [])

  return(
    <p>It's <time dateTime={response}>{response}</time></p>
  )
}
*/

function App(){
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        

        <JoinForm
          socket={socket}
        />

      </header>
    </div>
  )
}

export default App