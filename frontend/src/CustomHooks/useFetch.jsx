import { useState, useEffect } from 'react'
import axios from 'axios'

const apiUrl = `http://localhost:8080`//TODO globalvariable

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

export default useFetch