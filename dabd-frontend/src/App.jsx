import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [message, setMessage] = useState("Cargando...")

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
      .then(response => setMessage(response.data.message))
      .catch(error => setMessage("Error al conectar con el backend"))
  }, [])

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export default App
