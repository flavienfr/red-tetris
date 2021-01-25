import { createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import JoinForm from './Components/JoinForm.jsx'
import Room from './Components/Room.jsx'
import { Switch, Route, Link } from 'react-router-dom'

const io = require("socket.io-client")

const apiUrl = `http://localhost:8080`//TODO globalvariable
const socket = io(apiUrl)

let test = 'ca marche'
export const GlobalContext = createContext(test)

function App(){
  return (
    <div className="App">

      <GlobalContext.Provider value={test}>
        <Switch>
          <Route exact path='/' component={JoinForm}/>
          <Route exact path='/:room[:player_name]' component={Room}/>
        </Switch>
      </GlobalContext.Provider>

      <Link to='/the_room[The_player_name]'>Back</Link>
    </div>
  )
}

export default App

/*
import logo from './logo.svg'

<header className="App-header">
<img src={logo} className="App-logo" alt="logo" />
*/

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