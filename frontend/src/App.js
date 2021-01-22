/*import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

const apiUrl = `http://localhost:8080`;

class App extends Component {
  state = {
    data: "empty"
  };

  async loadData() {
    const res = await axios.get(apiUrl + '/');
    this.setState({
      data: res.data
    });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Api data from root request: {this.state.data}</p>
        </header>
      </div>
    );
  }
}

export default App;
*/

import React, { useState, useEffect } from "react"
//import socketIOClient from "socket.io-client"
const io = require("socket.io-client");
const apiUrl = `http://localhost:8080`;

function ClientComponent() {
  const [response, setResponse] = useState("")

  useEffect(() => {
	//const socket = socketIOClient(apiUrl)
	const socket = io(apiUrl, {
	  });
	
    socket.on("FromAPI", data => {
    setResponse(data)
    })

    return () => socket.disconnect()
  }, [])
  
  return (
    <p>
    It's <time dateTime={response}>{response}</time>
    </p>
  )
}

function App() {
  const [loadClient, setLoadClient] = useState(true)
  return (
    <>
    {}
    <button onClick={() => setLoadClient(prevState => !prevState)}>
      STOP CLIENT
    </button>
    {}
    {loadClient ? <ClientComponent /> : null}
    </>
  )
}

export default App