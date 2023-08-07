import { Slider } from '@mui/material';
import React from 'react';

//animates from each origin point

export function Faultline () {
    const canvas = React.createRef();
    const [column, setColumn] = React.useState(15);
    const [row, setRow] = React.useState(15);
    const [originCount, setOriginCount] = React.useState(200);
    //const [vectorDensity, setVectorDensity] = React.useState(1)
    const vectorArray = []; //store the tip and tail of each vector
    const originX = []; //store randomized points that spawn lines
    const originY = [];
    let count;
    let vectorEffectRadius = 50;

    function label(value) {
        return `${value}`;
    }

    React.useEffect(() => {
        let c = canvas.current.getContext('2d');
        const gradient = c.createLinearGradient(0, 500, 1000, 0);
        gradient.addColorStop(0, "#E30E7C");
        gradient.addColorStop(1, "#15D1E6");

        class Vector {
            constructor(x1, y1, x2, y2){
                this.x1 = x1;
                this.y1 = y1;
                this.x2 = x2;
                this.y2 = y2;
            }

            drawVector(){
                c.beginPath();
                c.moveTo(this.x1, this.y1);
                c.lineTo(this.x2, this.y2);
                c.stroke();       
            }

            drawFlow(){
                let dx = 0;
                let dy = 0;
                let closeVector = [];
                for(let w = 0; w < originX.length; w++){ //scans through every point
                    for(let o = 0; o < vectorArray.length; o++){ //compare against each vector
                        let distance1 = Math.sqrt((originX[w]-vectorArray[o].x1)*(originX[w]-vectorArray[o].x1)+(originY[w]-vectorArray[o].y1)*(originY[w]-vectorArray[o].y1));
                        let distance2 = Math.sqrt((originX[w]-vectorArray[o].x2)*(originX[w]-vectorArray[o].x2)+(originY[w]-vectorArray[o].y2)*(originY[w]-vectorArray[o].y2));
                        if(distance1 < vectorEffectRadius || distance2 < vectorEffectRadius){
                            closeVector.push(o);
                        }
                    }
                    for (let u = 0; u < closeVector.length; u++){
                        let num = closeVector[u];
                        dx = Math.floor((dx + (vectorArray[num].x2 - vectorArray[num].x1))/2);
                        dy = Math.floor((dy + (vectorArray[num].y1 - vectorArray[num].y2))/2);
                    }
                    c.beginPath();
                    c.moveTo(originX[w], originY[w]);
                    originX[w] = originX[w] - dx;
                    originY[w] = originY[w] + dy;
                    c.lineTo(originX[w], originY[w]);
                    c.strokeStyle = gradient;
                    c.stroke();
                    c.closePath();
                }
            }

        }

        const spawnVectors = () => {
            let columnStep = 1000/column;
            let rowStep = 500/row;
            for(let i = 0; i <= row; i++){
                let y1 = rowStep*i;
                for(let m = 0; m <= column; m++){
                    let x1=columnStep*m;
                    let x2= x1 + (columnStep * (Math.random()));
                    let y2= y1 + (rowStep * (Math.random() - 1));
                    vectorArray.push(new Vector(x1, y1, x2, y2))
                }
            }
            for(let j = 0; j < originCount; j++){ // spawn N points
                let x = Math.floor(Math.random() * (1000 - 5));
                let y = Math.floor(Math.random() * (500 - 5));
                originX.push(x);
                originY.push(y);
            }
            c.clearRect(0, 0, 1000, 500);
            // for (let n = 0; n < vectorArray.length; n++){ 
            //     vectorArray[n].drawVector(); //visualize vectors
            // }
        }

        spawnVectors();

        const render = () => {
                vectorArray[0].drawFlow();
                for (let i = 0; i < originX.length; i++){
                    if(originX[i] < 0 && originY[i] > 500){ count++ }
                }
                if (count === originX.length) {return;}
                requestAnimationFrame(render)
        }

        render();

    })

    const originCountUpdate = (event, newValue) => {
        setOriginCount(newValue);
    }
    
    const columnUpdate = (event, newValue) => {
        setColumn(newValue);
    }
    
    const rowUpdate = (event, newValue) => {
        setRow(newValue);
    }

    return (
        <>
            <canvas 
                ref={canvas} 
                height={500} 
                width={1000}
                style={{
                    border: "1px solid #000000"
                }}
            />
            <br/>
            Line Count: {originCount}
            <br/>
            <Slider
                aria-label='linecount'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                step={50}
                marks={true}
                track={false}
                min={100}
                max={500}
                defaultValue={200}
                onChangeCommitted={originCountUpdate}
                style={{
                    width: 500
                }}
            />
             <br/>
            Columns: {column}
            <br/>
            <Slider
                aria-label='column'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                step={5}
                marks={true}
                track={false}
                min={5}
                max={30}
                defaultValue={15}
                onChangeCommitted={columnUpdate}
                style={{
                    width: 500
                }}
            />
             <br/>
            Rows: {row}
            <br/>
            <Slider
                aria-label='linecount'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                step={5}
                marks={true}
                track={false}
                min={5}
                max={20}
                defaultValue={15}
                onChangeCommitted={rowUpdate}
                style={{
                    width: 500
                }}
            />
        </>
    )
}