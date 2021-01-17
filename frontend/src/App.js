import React, { Component } from 'react';
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