import React from 'react';

export function Homepage({setSelectedAlgo}) {
  const [Hover1, setHover1] = React.useState(false)
  const [Hover2, setHover2] = React.useState(false)
  const [Hover3, setHover3] = React.useState(false)

  return (
    <div style={{
      position: 'relative'
    }}>

      <p style={{
        color: 'black'
      }}>
      placeholder about me text
      </p>
      <br/>
      <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
      }}>
        <button style={{
          width: "320px",
          border: 'none',
          background: 'none'
        }} onClick={() => setSelectedAlgo("Algo1")}> 
        <img src="./resources/connections.png" width="100%"/>
        </button>

        <button style={{
          border: 'none',
          background: 'none',
          marginLeft: '30px',
          marginRight: '30px'
        }} onClick={() => setSelectedAlgo("Algo2")}> 
        <img src="./resources/perspective.png" width="100%"/>
        </button>

        <button style={{
          border: 'none',
          background: 'none'
        }} onClick={() => setSelectedAlgo("Algo3")}> 
        <img src="./resources/faultline.png" width="100%"/>
        </button>
      </div>
    </div>
  )
}
