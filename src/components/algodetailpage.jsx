import { Connections } from "./connections.jsx";
import { Perspective } from "./perspective.jsx";
import { Faultline } from "./faultlines.jsx";
import { Waves } from "./waves.jsx";
import { Sphere } from "./ballperspective.jsx"

export function Algodetailpage({ algo }) { //accepts the selected algo
    
    const getDescription = ()=> {
        if(algo === "Algo1"){
            return <>
            <b style={{
                fontSize: '40px',
            }}>
                Connections
            </b>
            <br/>
                Inspired by the way we're all connected, Connections is a exploration of how any interation - no matter how brief - changes the course of our lives forever.
            </>
        }
        else if(algo === "Algo2"){
            return <>
            <b style={{
                fontSize: '40px',
            }}>
                Perspectives
            </b>
            <br/>
                Sometimes a change of perspective is all you need.
            </>
        }
        else if(algo === "Algo3"){
            return <>
            <b style={{
                fontSize: '40px',
            }}>
                Faultlines
            </b>
            <br/>
                Experimentation with vector fields
            </>
        }
        else if(algo === "Algo4"){
            return <>
            <b style={{
                fontSize: '40px',
            }}>
                Trying something new
            </b>
            <br/>
                Work in progress!
            </>
        }
        else if(algo === "Algo5"){
            return <>
            <b style={{
                fontSize: '40px',
            }}>
                Trying something new
            </b>
            <br/>
                Work in progress!
            </>
        }
        else return `placeholder text for ${algo}`
    }

    return(
    <div style={{ //3 columns 2 rows
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
        gridTemplateRows: 'minmax(0, 3fr) minmax(0, 3fr)',
        gridGap: '4px',
        maxHeight: '100%',
        margin: '1rem'
    }}> 
        
        <p style={{ 
            gridColumn: 1,
            gridRow: 1,
            color: 'black'
        }}>
            <br/>
            {getDescription()}
        </p>
        
        {/* Algo Selection */}
        <div style={{
            gridColumn: "2 / span 2",
            gridRow: "1 / span 2"
        }}> 
            {algo === 'Algo1' && <Connections/>} 
            {algo === 'Algo2' && <Perspective/>}
            {algo === 'Algo3' && <Faultline/>}
            {/* {algo === 'Algo4' && <Waves/>}
            {algo === 'Algo5' && <Sphere/>} */}
        </div>
    </div>
    )
}