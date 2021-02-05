import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import JoinForm from './Components/JoinForm.jsx'
import Room from './Components/Room.jsx'
import { Switch, Route } from 'react-router-dom'

const io = require("socket.io-client")

const apiUrl = `http://localhost:8080`//TODO globalvariable
export const socket = io(apiUrl)

function App(){
  return (
    <div className="App">
      <Switch>
        <Route exact path='/:room[:player_name]' component={Room}/>
        <Route path='/' component={JoinForm}/>
      </Switch>
    </div>
  )
}

export default App

//TODO: path url /#d/ffsd;l;'l'l;[fdgfdgfd] and
// form weir caractere