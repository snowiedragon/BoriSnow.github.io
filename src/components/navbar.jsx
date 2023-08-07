import './navbar.css';

export function Navbar({setSelectedAlgo}) {

    const clearSelectedAlgo = () => {
        setSelectedAlgo('')
        console.log("Clearing selected algo")
    }

  return (
      <div>
        <button style={{
          border: 'none',
          background: 'none'
        }} onClick={clearSelectedAlgo}> 
          <p>
          Homepage
          </p>
        </button>
        |
        <button style={{
          border: 'none',
          background: 'white'
        }} onClick={() => setSelectedAlgo("Algo1")}> 
          <p>
          Connections
          </p>
        </button>
        |
        <button style={{
          border: 'none',
          background: 'white'
        }} onClick={() => setSelectedAlgo("Algo2")}> 
          <p>
          Perspectives
          </p>
        </button>
        |
        <button style={{
          border: 'none',
          background: 'none'
        }} onClick={() => setSelectedAlgo("Algo3")}> 
          <p>
          Faultlines
          </p>
        </button>
        |
        <button style={{
          border: 'none',
          background: 'none'
        }} onClick={() => setSelectedAlgo("Algo4")}> 
         <p style={{
          color: 'red'
         }}>
          Growth
         </p>
        </button>
    </div>
  )
}
