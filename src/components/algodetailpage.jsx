import { Connections } from "./connections.jsx";
import { Perspective } from "./perspective.jsx";
import { Faultline } from "./faultlinesquadrants.jsx";
import { Growth } from "./growth.jsx";

export function Algodetailpage({ algo }) { //accepts the selected algo
    
    const getDescription = ()=> {
        if(algo === "Algo1"){
            return "Neurons - to do; find that gif"
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
            {algo === 'Algo4' && <Growth/>}
        </div>
    </div>
    )
}