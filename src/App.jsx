import { useState } from 'react'
import './App.css'
import { Navbar } from './components/navbar'
import { Homepage } from './components/homepage'
import { Algodetailpage } from './components/algodetailpage'

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
