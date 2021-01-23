import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

const apiUrl = `http://localhost:8080`;

function useFetch(urlPath) {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios
      .get(apiUrl + urlPath)
      .then((res) => {
        setResponse(res.data)
        setLoading(false)
      })
      .catch(() => {
          setHasError(true)
          setLoading(false)
      })
  }, [urlPath])

  return [response, loading, hasError]
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
      </header>
    </div>
  )
}

export default App;