import { Slider } from "@mui/material";
import React from "react";

function sliderLabel(value){
    return `${value}`
}

export function Faultline(){
    const canvas = React.createRef()
    const [column, setColumn] = React.useState(15)
    const [row, setRow] = React.useState(15)
    const [originCount, setOriginCount] = React.useState(200)
    const vectorArray = []
    const originArray = []

    function getWidth(){
        return window.innerWidth * 0.6
    }

    function getHeight(){
        return window.innerHeight * 0.6
    }

    React.useEffect(() => {
        let c = canvas.current.getContext('2d')
        
        const g = c.createLinearGradient(0, getHeight(), getWidth(), 0)
        g.addColorStop(0, "#E30E7C")
        g.addColorStop(1, "#15D1E6")

        class Vector{
            constructor(x1, y1, x2, y2){
                this.x1 = x1
                this.y1 = y1
                this.x2 = x2
                this.y2 = y2
            }

            debugDrawVector(){
                c.beginPath()
                c.moveTo(this.x1, this.y1)
                c.lineTo(this.x2, this.y2)
                c.strokeStyle = 'black'
                c.stroke()
                c.closePath()
            }
        }

        class Origin{
            constructor(x, y){
                this.x = x
                this.y = y
            }

            draw(){
                let dx, dy, cV
                let gridSquare = []
                let adjacentVectors = []
                c.beginPath()
                c.moveTo(this.x, this.y)
                gridSquare.push(Math.floor(this.x/(getWidth()/column)))
                gridSquare.push(Math.floor(this.y/(getHeight()/row)))
                gridSquare.push(Math.ceil(this.x/(getWidth()/column)))
                gridSquare.push(Math.ceil(this.y/(getHeight()/row)))
                cV = gridSquare[1] * (column + 1) + gridSquare[0]
                adjacentVectors.push(cV)
                cV = gridSquare[1] * (column + 1) + gridSquare[3]
                adjacentVectors.push(cV)
                cV = gridSquare[2] * (column + 1) + gridSquare[0]
                adjacentVectors.push(cV)
                cV = gridSquare[2] * (column + 1) + gridSquare[3]
                adjacentVectors.push(cV)
                for(let i = 0; i < 4; i++){
                    dx += (vectorArray[adjacentVectors[i]].x2 - vectorArray[adjacentVectors[i].x1])/2
                    dy += (vectorArray[adjacentVectors[i]].y1 - vectorArray[adjacentVectors[i].y2])/2
                }
                this.x -= Math.round(dx)
                this.y += Math.random(dy)
                c.lineTo(this.x, this.y)
                c.strokeStyle = g
                c.stroke()
                c.closePath()
            }
        }

        function spawnVectors(){
            let columnStep = getWidth()/column
            let rowStep = getHeight()/row
            for(let i = 0; i <= row; i++){
                let y1 = rowStep * i
                for(let m = 0; m <= column; m++){
                    let x1 = columnStep * m
                    let x2 = x1 + (columnStep * (Math.random()))
                    let y2 = y1 + (rowStep * (Math.random() - 1))
                    vectorArray.push(new Vector(x1, y2, x2, y2))
                }
            }
        }

        function spawnOrigin(){
            for(let i = 0; i < originCount; i++){
                originArray.push(new Origin(Math.random() * (getWidth() - 5), Math.random() * (getHeight() - 5)))
            }
        }

        function drawFault(){
            for(let i = 0; i < originArray.length; i++){
                while(originArray[i].x > 0 && originArray[i].y < getHeight()){
                    originArray[i].draw()
                }
            }
        }

        spawnVectors()
        spawnOrigin()
        drawFault()

        // function render(){
        //     c.clearRect(0, 0, getWidth(), getHeight())
            
        // }

    }, [origin, column, row])

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

    const originUpdate = (event, newValue) => {
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
            height={getHeight()} 
            width={getWidth()}
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
            onChangeCommitted={originUpdate}
            style={{
                width: getWidth()
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
                width: getWidth()
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
                width: getWidth()
            }}
        />
    </>
    )
} 