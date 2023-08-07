import { useState } from 'react'
import './App.css'
import { Navbar } from './components/navbar.jsx'
import { Homepage } from './components/homepage.jsx'
import { Algodetailpage } from './components/algodetailpage.jsx'

function App() {
  const [selectedAlgo, setSelectedAlgo] = useState('')
  return (
    <>
          <Navbar setSelectedAlgo={setSelectedAlgo} />
      <hr />
      {selectedAlgo === '' && <Homepage setSelectedAlgo={setSelectedAlgo}/>}
      {selectedAlgo !== '' && <Algodetailpage algo={selectedAlgo}/>}
    </>
  )
}

export default App
