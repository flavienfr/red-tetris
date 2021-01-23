import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import useFetch from './CustomHooks/useFetch'

const apiUrl = `http://localhost:8080`//TODO globalvariable
const io = require("socket.io-client")

function ClockServerComponent() {
	const [response, setResponse] = useState("")
  useEffect(() => {
    const socket = io(apiUrl)

	  socket.on("FromAPI", data => {
	  	setResponse(data)
	  })
    return () => socket.disconnect()
	}, [])
	
	return(
	  <p>It's <time dateTime={response}>{response}</time></p>
	)
}

function App(){
  const [data, loading, hasError] = useFetch("/")

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {
          loading ? <p>Loading...</p> :
          (hasError ? <p>Error occured.</p> : 
            <p>Api data from root request: {data}</p>)
        }
		<ClockServerComponent/>
      </header>
    </div>
  )
}

export default App