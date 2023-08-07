import { Slider } from '@mui/material';
import React from 'react';

let nodeCount = 50;
let lastNodeCount = nodeCount;
var velocityMultiplier = 1;
var nodeLine = 70;
let savedVelocity = velocityMultiplier;

function sliderLabel(value){
    return `${value}`;
}

export function Connections() {
    const canvas = React.createRef();
    const [toggle, setToggle] = React.useState(true);

    let nodeArray = [];

    React.useEffect(() => {
        let c = canvas.current.getContext('2d');

        class Node {
            constructor(x, y, dx, dy){
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
            }

            drawCircle(){
                c.beginPath()
                    c.arc(this.x, this.y, 5, 0, Math.PI*2);
                    c.strokeStyle = "#FFFFFF";
                    c.fillStyle = "#1883db";
                    c.lineWidth = 2;
                    c.fill();
                    c.stroke();
            }

            drawLine(m){
                c.beginPath();
                c.moveTo(this.x, this.y);
                c.lineTo(nodeArray[m].x, nodeArray[m].y);
                const gradient = c.createLinearGradient(this.x, this.y, nodeArray[m].x, nodeArray[m].y);
                gradient.addColorStop(0, "transparent");
                gradient.addColorStop(0.5, "#1883db");
                gradient.addColorStop(1, "transparent");
                c.strokeStyle = gradient;
                c.lineWidth = "2px";
                c.stroke();
            }

            handleCollision(m){
                let yPointPos = this.x + (nodeArray[m].y - nodeArray[m].x);
                let yPointNeg = -this.x + (nodeArray[m].y - nodeArray[m].x);
                if((this.y >= yPointPos && this.y >= yPointNeg) || (this.y <= yPointPos & this.y <= yPointNeg)) { //top & bottom quadrant
                    this.dy = -this.dy;
                    nodeArray[m].dy = -nodeArray[m].dy
                }
                else { //right & left quadrants
                    this.dx = -this.dx
                    nodeArray[m].dx = -nodeArray[m].dx
                }
            }

            updateCircle(){
                for(let m = 0; m < nodeArray.length; m++){
                    let distance = Math.sqrt((this.x - nodeArray[m].x)*(this.x - nodeArray[m].x)+(this.y - nodeArray[m].y)*(this.y - nodeArray[m].y))
                    if (distance <= 11 && distance != 0){
                        this.handleCollision(m);
                    }
                    if (distance <= nodeLine && distance != 0){
                        this.drawLine(m);
                    }
                }
                if(this.x + 5 > 1000 || this.x - 5 < 0){ this.dx = -this.dx }
                if(this.y + 5 > 500 || this.y - 5 < 0){ this.dy = -this.dy }
                this.x += (this.dx * velocityMultiplier);
                this.y += (this.dy * velocityMultiplier);
                this.drawCircle();
            }

        }

        const spawnNodes = (n) => {
            for(let i = 0; i < n; i++){
                let x = Math.random() * (995 - 6) + 6;
                let y = Math.random() * (495 - 6) + 6;
                let dx = (Math.random() * (1) - 0.5); //randomize starting direction
                let dy = (Math.random() * (1) - 0.5);
                if(dx >= -0.2 && dx <= 0.2){ //prevent stars from travelling too slowly
                    dx += 0.2;
                }
                if(dy >= -0.2 && dy <= 0.2){
                    dy += 0.2;
                }
                nodeArray.push(new Node(x, y, dx, dy))
                lastNodeCount = nodeCount;
            }
        }

        spawnNodes(nodeCount);

        const render = () => {
            c.clearRect(0, 0, 1000, 500);
            if (lastNodeCount < nodeCount){
                let n = nodeCount - lastNodeCount
                spawnNodes(n);
            }
            for(let i = 0; i < nodeArray.length; i++){
                nodeArray[i].updateCircle();
            }
            lastNodeCount = nodeCount;
            requestAnimationFrame(render);
        }

        render();

        document.getElementById('stop').addEventListener('click', function(){
            savedVelocity = velocityMultiplier;
            velocityMultiplier = 0;
        })

        document.getElementById('resume').addEventListener('click', function(){
            velocityMultiplier = savedVelocity;
        })

        document.getElementById('regenerate').addEventListener('click', function(){
            nodeCount = lastNodeCount;
            setToggle(!toggle)
        })

        document.getElementById('download').addEventListener('click', function(){
            let can = document.getElementById("constcanvas");
            let canvasUrl = can.toDataURL();
            const canvasElement = document.createElement('a');
            canvasElement.href = canvasUrl;
            canvasElement.download = "connections.png";
            canvasElement.click();
        })


    }, [toggle]);

    const densityUpdate = (event, newValue) => {
        if(lastNodeCount < newValue){ //increase the number of nodes
            nodeCount = newValue
        }
        if(lastNodeCount > newValue){ //decrease the number of nodes
            let n = newValue - 1
            nodeCount = newValue;
            nodeArray = nodeArray.slice(0, n)
        }
    }

    const velocityMultiplierUpdate = (event, newValue) => {
        velocityMultiplier = newValue;
        savedVelocity = velocityMultiplier;
    }

    const nodeLineUpdate = (event, newValue) => {
        nodeLine = newValue;
    }

    return(
        <>
            <canvas 
                ref={canvas} 
                id="constcanvas"
                height={500} 
                width={1000}
                style={{
                    background: "#000000"
                }}
            />
            <br/>
            <input type="button" value="STOP!" id="stop"/>
            <input type="button" value="RESUME!" id="resume"/>
            <input type="button" value="REDO!" id="regenerate"/>
            <input type="button" value="Download Image!" id="download"/>
            <br/>
            Node Density:
            <br/>
            <Slider
                aria-label='star-density'
                getAriaValueText={sliderLabel}
                valueLabelDisplay='auto'
                step={5}
                marks={true}
                track={false}
                min={30}
                max={100}
                defaultValue={50}
                onChangeCommitted={densityUpdate}
                style={{
                    width: 500
                }}
            />
            <br/>
            Velocity Multiplier:
            <br/>
            <Slider
                aria-label='velocity-modifier'
                getAriaLabel={sliderLabel}
                valueLabelDisplay='auto'
                step={0.2}
                marks={true}
                track={false}
                min={0}
                max={3}
                defaultValue={1}
                onChange={velocityMultiplierUpdate}
                style={{
                    width: 500
                }}
            />
            <br/>
            Line Proximity:
            <br/>
            <Slider
                aria-label='lineproximity'
                getAriaLabel={sliderLabel}
                valueLabelDisplay='auto'
                step={10}
                marks={true}
                track={false}
                min={50}
                max={150}
                defaultValue={70}
                onChange={nodeLineUpdate}
                style={{
                    width: 500
                }}
            />
        </>
    )

}