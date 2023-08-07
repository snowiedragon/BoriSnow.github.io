import { Slider } from '@mui/material';
import React from 'react';

//no animation (freezes after a few rerenders though)

export function Faultline () {
    const canvas = React.createRef();
    const [column, setColumn] = React.useState(15);
    const [row, setRow] = React.useState(15);
    const [originCount, setOriginCount] = React.useState(200);
    const vectorArray = [];
    let originX = [];
    let originY = [];
    let cV;

    function sliderLabel(value) {
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
                c.strokeStyle = 'black';
                c.stroke();
                c.closePath();
            }

            drawFault(){
                let rightCheck;
                let leftCheck;
                for(let i = 0; i < originX.length; i++){ //scans each point
                    let dx = 0;
                    let dy = 0;
                    c.beginPath();
                    c.moveTo(originX[i], originY[i]);
                    //console.log("(" + originX[i] + ", " + originY[i] + ")");
                    while(originX[i] > 0 || originY[i] < 500){ //until the line reaches an edge
                        let closeVector = [];
                        let vecX = Math.floor(originX[i]/(1000/column));
                        let vecY = Math.floor(originY[i]/(500/row));
                        let vecX2 = Math.ceil(originX[i]/(1000/column));
                        let vecY2 = Math.ceil(originY[i]/(500/row));
                        cV = vecY * (column + 1) + vecX;
                        if(cV > vectorArray.length || cV < 0) {break;}
                        closeVector.push(cV);
                        cV = vecY * (column + 1) + vecX2;
                        if(cV > vectorArray.length || cV < 0) {break;}
                        closeVector.push(cV);
                        cV = vecY2 * (column + 1) + vecX;
                        if(cV > vectorArray.length || cV < 0) {break;}
                        closeVector.push(cV);
                        cV = vecY2 * (column + 1) + vecX2;
                        if(cV > vectorArray.length || cV < 0) {break;}
                        closeVector.push(cV);
                        for (let n = 0; n < 4; n++){ //adds the influence of each vector
                            let num = closeVector[n];
                            //console.log(num)
                            dx = Math.round((dx + (vectorArray[num].x2 - vectorArray[num].x1))/2);
                            dy = Math.round((dy + (vectorArray[num].y1 - vectorArray[num].y2))/2);
                        }
                        originX[i] = originX[i] - dx;
                        originY[i] = originY[i] + dy;
                        c.lineTo(originX[i], originY[i]);
                    }
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
                let x = Math.random() * (1000 - 5);
                let y = Math.random() * (500 - 5);
                originX.push(x);
                originY.push(y);
            }
            c.clearRect(0, 0, 1000, 500);
            // for(let k = 0; k < vectorArray.length; k++){
            //     vectorArray[k].drawVector();
            // }
            vectorArray[0].drawFault();
        }

        spawnVectors();


    }, [originCount, column, row])

    const getImage = () => {
        React.useEffect(() => {
            document.getElementById('download').addEventListener('click', function(){
                let can = document.getElementById("faultlinecanvas");
                let canvasUrl = can.toDataURL();
                const canvasElement = document.createElement('a');
                canvasElement.href = canvasUrl;
                canvasElement.download = "faultline.png";
                canvasElement.click();
            })
        }, [])
    }    

    const originCountUpdate = (event, newValue) => {
        setOriginCount(newValue);
    }
    
    const columnUpdate = (event, newValue) => {
        setColumn(newValue);
    }
    
    const rowUpdate = (event, newValue) => {
        setRow(newValue);
    }

    return(
        <>
        <canvas 
            ref={canvas} 
            id="faultlinecanvas"
            height={500} 
            width={1000}
            style={{
                border: "1px solid #000000"
            }}
        />
        <br/>
        <input type="button" value="Download Image!" id="download" onClick={getImage()}/>
        <br/>
        Line Count: {originCount}
        <br/>
        <Slider
            aria-label='linecount'
            getAriaLabel={sliderLabel}
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
            getAriaLabel={sliderLabel}
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
            getAriaLabel={sliderLabel}
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