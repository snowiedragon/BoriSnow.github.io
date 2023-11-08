import React from'react';
import { Slider } from '@mui/material';

function label(value) {
    return `${value}`;
}

export function Perspective() {
    const canvas = React.useRef();
    const [horizonLine, setHorizonLine] = React.useState(250); //customize the height of the horizon line
    const [vanishingPoint, setVanishingPoint] = React.useState(20); //the distance between the vanishing points and the canvas edge
    const [cubeProportion, setCubeProportion] = React.useState(3); //size of the cubes
    const [spacing, setSpacing] = React.useState(40) //distance between each cube
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
                c.beginPath();
                c.moveTo(this.x, this.y);
                c.lineTo(this.x, 500);
                const vGradient = c.createLinearGradient(this.x, this.y, this.x, 500);
                gradientVertical.addColorStop(0, "white");
                gradientVertical.addColorStop(1, "transparent");
                c.strokeStyle = gradientVertical;
                c.lineWidth = "4px";
                c.stroke();
            }

            drawLine(){
                let count = 0;
                for(let i = 0; i < vertexArray.length; i++){

                }
            }
        }

        const initializeCanvas = () => {
            c.clearRect(0, 0, 1000, 500);
            c.beginPath();
            c.moveTo(vanishL[0], vanishL[1]);
            c.lineTo(vanishR[0], vanishR[1]);
            c.strokeStyle = "white";
            c.lineWidth = "2px";
            c.stroke();
            c.closePath();
        }

        initializeCanvas();

        const spawnPoints = () => {
            let x = 500;
            let y = 450;
            vertexArray.push(new Point(x, y));
            let difference = 600;
            let cubeSpace = spacing;
            let mL = (vanishL[1] - y)/(vanishL[0] - x); //Slope of the line between the initial point and LVP
            let bL = y - (mL*x);
            let mR = (vanishR[1] - y)/(vanishR[0] - x); //Slope of the line between the initial point and RVP
            let bR = y - (mR*x);
            
        }

        spawnPoints();
    })

} 