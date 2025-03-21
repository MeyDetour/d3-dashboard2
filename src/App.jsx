import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LinePlot from "./page/LinePlot.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LinePlot data={[12, 14, 15, 13, 17, 19, 22, 20, 18, 16]   }></LinePlot>
    </>
  )
}

export default App
