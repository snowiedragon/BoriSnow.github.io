import React from 'react';
import { Slider } from '@mui/material';

function label(value) {
    return `${value}`;
}

export function Perspective() {
    const canvas = React.useRef();
    const [horizonLine, setHorizonLine] = React.useState(250); //customize the horizon line
    const [vanishingPoint, setVanishingPoint] = React.useState(20); // how near or far the left VP is from the edge of the canvas
    const [cubeProportion, setCubeProportion] = React.useState(3); // how large or small cubes will be
    const [spacing, setSpacing] = React.useState(40);
    let initialPoint = [500, 450]; // static for now, the vertex closest to the camera
    let vanishL = [0 - vanishingPoint, horizonLine]; // array containing the left VP
    let vanishR = [1000 + vanishingPoint, horizonLine]; // array containing the right VP
    const vertexArray = []; //store the vertices of every cube

    React.useEffect(() => {
        let c = canvas.current.getContext('2d');

        class Point {
            constructor(x, y){
                this.x = x;
                this.y = y;
            }

            drawVerticalLine(){
                c.beginPath()
                c.moveTo(this.x, this.y);
                c.lineTo(this.x, 500);
                const gradientVertical = c.createLinearGradient(this.x, this.y, this.x, 500);
                gradientVertical.addColorStop(0, "white");
                gradientVertical.addColorStop(1, "transparent");
                c.strokeStyle = gradientVertical;
                c.lineWidth = "4px";
                c.stroke();
            }

            drawLine() {
                let count = 0;
                let next;
                for(let i = 0; i < vertexArray.length; i++){
                    c.beginPath();
                    const gradient = c.createLinearGradient(vanishL[0], vanishL[1], vanishR[0], vanishR[1]);
                    gradient.addColorStop(0, "transparent");
                    gradient.addColorStop(0.5, "white");
                    gradient.addColorStop(1, "transparent");
                    next = i + 2;
                    if (next >= vertexArray.length) {return;}
                    if (count === 5) {count = 1}
                    if (count === 0){
                        c.moveTo(vertexArray[1].x, vertexArray[1].y);
                        c.lineTo(vertexArray[0].x, vertexArray[0].y);
                        c.lineTo(vertexArray[2].x, vertexArray[2].y);
                        c.strokeStyle = gradient;
                        c.lineWidth = "4px";
                        c.stroke();
                        c.closePath();
                    }
                    if (count === 1){
                        c.moveTo(vertexArray[i].x, vertexArray[i].y);
                        c.lineTo(vanishR[0], vanishR[1]);
                        c.strokeStyle = gradient;
                        c.lineWidth = "4px";
                        c.stroke();
                        c.closePath();
                    }
                    if (count === 2){
                        c.moveTo(vertexArray[i].x, vertexArray[i].y);
                        c.lineTo(vanishL[0], vanishL[1]);
                        c.strokeStyle = gradient;
                        c.lineWidth = "4px";
                        c.stroke();
                        c.closePath();
                    }
                    if (count === 3){
                        c.moveTo(vertexArray[next].x, vertexArray[next].y);
                        c.lineTo(vertexArray[i].x, vertexArray[i].y);
                        c.lineTo(vanishR[0], vanishR[1]);
                        c.strokeStyle = gradient;
                        c.lineWidth = "4px";
                        c.stroke();
                        c.closePath();
                    }
                    if (count === 4){
                        c.moveTo(vertexArray[next].x, vertexArray[next].y);
                        c.lineTo(vertexArray[i].x, vertexArray[i].y);
                        c.lineTo(vanishL[0], vanishL[1]);
                        c.strokeStyle = gradient;
                        c.lineWidth = "4px";
                        c.stroke();
                        c.closePath();
                    }
                    count++;
                }
                return;
            }
        }

        const linePoint = () => {
            c.clearRect(0, 0, 1000, 500);
            c.beginPath();
            c.moveTo(vanishL[0], vanishL[1]);
            c.lineTo(vanishR[0], vanishR[1]);
            c.strokeStyle = "white";
            c.lineWidth = "2px";
            c.stroke();
            c.closePath();
            let x = initialPoint[0]
            let y = initialPoint[1];
            let xL = x;
            let yL = y;
            let yR = y;
            let xR = x;
            let n = 1;
            let difference = 600;
            let proportion = cubeProportion;
            let spaces = spacing
            let mL = (vanishL[1] - y)/(vanishL[0] - xL); //Slope of IP to LVP
            let bL = y - (mL*x); //y-int of L
            let mR = (vanishR[1] - y)/(vanishR[0] - xR); //Slope of IP to RVP
            let bR = y - (mR*x); //y-int of R
            vertexArray.push(new Point(x, y))

            while (xL > vanishL[0] || xR < vanishR){ //5 boxes generated
                //xL and xR begins at initialPoint or the last point it was at
                xL = xL - (difference/proportion);
                yL = mL*xL+bL;
                xR = xR + (difference/proportion);
                yR = mR*xR+bR;
                difference = difference - (difference/proportion);
                if (xL < vanishL[0] || xR > vanishR) {break}
                vertexArray.push(new Point(xL, yL))
                vertexArray.push(new Point(xR, yR))
                xL = xL - (spaces/proportion);
                yL = mL*xL+bL;
                xR = xR + (spaces/proportion);
                yR = mR*xR+bR;
                spaces = spaces - (spaces/proportion);
                proportion++;
                if (xL < vanishL[0] || xR > vanishR) {break}
                vertexArray.push(new Point(xL, yL))
                vertexArray.push(new Point(xR, yR))
                n++;
            }
            vertexArray[0].drawLine();
                for (let i = 0; i < vertexArray.length; i++){
                    vertexArray[i].drawVerticalLine();
                }
        }

        linePoint();

    })

    const getImage = () => {
        React.useEffect(() => {
            document.getElementById('download').addEventListener('click', function(){
                let can = document.getElementById("perspectivecanvas");
                let canvasUrl = can.toDataURL();
                const canvasElement = document.createElement('a');
                canvasElement.href = canvasUrl;
                canvasElement.download = "perspective.png";
                canvasElement.click();
            })
        }, [])
    }    


    const spacingUpdate = (event, newValue) => {
        setSpacing (newValue);
    }

    const horizonUpdate = (event, newValue) => {
        setHorizonLine (newValue);
    }
    
    const vanishingPointUpdate = (event, newValue) => {
        setVanishingPoint (newValue);
    }

    const cubeProportionUpdate = (event, newValue) => {
        setCubeProportion (newValue);
    }


    return(
        <>
            <canvas
                ref={canvas}
                id="perspectivecanvas"
                height={500}
                width={1000}
                style={{
                    background: "#000000"
                }}
            />
            <br/>
            <input type="button" value="Download Image!" id="download" onClick={getImage()}/>
            <br/>
            Cube Spacing: {spacing}
            <br/>
            <Slider
                aria-label='spacing'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                step={5}
                marks={true}
                track={false}
                min={10}
                max={100}
                value={spacing}
                onChange={spacingUpdate}
                style={{
                    width: 500
                }}
            />
            <br/>
            Horizon Line: {horizonLine}
            <br/>
            <Slider
                aria-label='horizonLine'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                step={10}
                marks={true}
                track={false}
                min={100}
                max={400}
                value={horizonLine}
                onChange={horizonUpdate}
                style={{
                    width: 500
                }}
            />
            <br/>
            Vanishing Points: {vanishingPoint}
            <br/>
            <Slider
                aria-label='VP'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                step={10}
                marks={true}
                track={false}
                min={0}
                max={100}
                value={vanishingPoint}
                onChange={vanishingPointUpdate}
                style={{
                    width: 500
                }}
            />
            <br/>
            Cube Proportion: {cubeProportion}
            <br/>
            <Slider
                aria-label='cubeProportion'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                step={1}
                marks={true}
                track={false}
                min={2}
                max={5}
                value={cubeProportion}
                onChange={cubeProportionUpdate}
                style={{
                    width: 500
                }}
            />
        </>
    )
}