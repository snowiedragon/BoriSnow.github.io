import { Slider } from '@mui/material';
import React from 'react';

//Set default values
let nodeCount = 50, lastNodeCount = 50
var velocityMultiplier = 1, savedVelocity = 1
var nodeline = 70

function sliderLabel(value){
    return `${value}`
}

export function Connections(){
    const canvas = React.createRef()

    const getWidth = () => {
        return window.innerWidth * 0.6
    }
    const getHeight = () => {
        return window.innerHeight * 0.6
    }
    let nodeArray = [];

    React.useEffect(() => {
        let c = canvas.current.getContext('2d')

        c.canvas.width = getWidth()
        c.canvas.height = getHeight()
        console.log("Width: [" + getWidth() + "] Height: [" + getHeight() + "]")


        class Node{
            constructor(x, y, dx, dy){
                this.x = x
                this.y = y
                this.dx = dx
                this.dy = dy
            }

            //Draw on canvas
            drawNode(){
                c.beginPath()
                c.arc(this.x, this.y, 5, 0, Math.PI*2);
                c.strokeStyle = "#FFFFFF";
                c.fillStyle = "#1883db";
                c.lineWidth = 2;
                c.fill();
                c.stroke();
            }

            //Draw connections
            drawLine(otherNode){
                c.beginPath()
                c.moveTo(this.x, this.y)
                c.lineTo(otherNode.x, otherNode.y)
                const g = c.createLinearGradient(this.x, this.y, otherNode.x, otherNode.y)
                g.addColorStop(0, "transparent")
                g.addColorStop(0.5, "#1883db")
                g.addColorStop(1, "transparent")
                c.strokeStyle = g
                c.lineWidth = "2px"
                c.stroke()
            }

            //Update position on canvas
            update(){
                this.x += (this.dx * velocityMultiplier)
                this.y += (this.dy * velocityMultiplier)
                if(this.x > getWidth() - 5 || this.x < 4){this.dx = -this.dx}
                if(this.y > getHeight() - 5 || this.y < 4){this.dy = -this.dy}
                for(let i = 0; i < nodeArray.length; i++){
                    let distance = this.getDistance(nodeArray[i])
                    if (distance <= 11 && distance != 0){
                        this.collide(nodeArray[i])
                    }
                    else if (distance <= nodeline && distance != 0){
                        this.drawLine(nodeArray[i])
                    }
                }
                this.drawNode()
            }

            collide(otherNode){
                let yPointPos = this.x + (otherNode.y - otherNode.x);
                let yPointNeg = -this.x + (otherNode.y - otherNode.x);
                if((this.y >= yPointPos && this.y >= yPointNeg) || (this.y <= yPointPos & this.y <= yPointNeg)) { //top & bottom quadrant
                    this.dy = -this.dy;
                    otherNode.dy = -otherNode.dy
                }
                else { //right & left quadrants
                    this.dx = -this.dx
                    otherNode.dx = -otherNode.dx
                }
            }

            getDistance(otherNode){
                return Math.sqrt(Math.pow((this.x - otherNode.x), 2) + Math.pow((this.y-otherNode.y), 2))
            }
        }

        const detectOverlap = () => {
            for(let i = 0; i < nodeArray.length; i++){
                for(let j = 0; j < nodeArray.length; j++){
                    if(nodeArray[i].getDistance(nodeArray[j]) <= 10 && nodeArray[i].getDistance(nodeArray[j]) != 0){
                        nodeArray[j].x += 10
                        nodeArray[j].y += 10
                    }
                nodeArray[i].drawNode()
                }
            }
        }

        //Generate coordinates and velocity for new nodes
        const spawnNodes = (n) => {
            for(let i = 0; i < n; i++){
                let x = Math.random() * (getWidth() - 10) + 10
                let y = Math.random() * (getHeight() - 10) + 10
                let dx = (Math.random() * 1 - 0.5)
                let dy = (Math.random() * 1 - 0.5)
                if(dx >= -0.2 && dx <= 0.2){ //prevent nodes from travelling too slowly
                    if(dx > 0){
                        dx += 0.2
                    }
                    else{
                        dx -= 0.2
                    }
                }
                if(dy >= -0.2 && dy <= 0.2){
                    if(dy > 0){
                        dy += 0.2
                    }
                    else{
                        dy -= 0.2
                    }
                }
                nodeArray.push(new Node(x, y, dx, dy))
            }
            detectOverlap()
            lastNodeCount = nodeCount;
        }

        spawnNodes(nodeCount)

        window.addEventListener('resize', resizeCanvas, false)
        
        function resizeCanvas(){
            c.canvas.width = getWidth()
            c.canvas.height = getHeight()
            nodeArray = []
            spawnNodes(nodeCount)
        }

        resizeCanvas()

        const render = () => {
            c.clearRect(0, 0, getWidth(), getHeight())
            if(lastNodeCount < nodeCount){
                let n = nodeCount - lastNodeCount
                spawnNodes(n)
            }
            for(let i = 0; i < nodeArray.length; i++){
                nodeArray[i].update()
            }
            lastNodeCount = nodeCount
            requestAnimationFrame(render)
        }

        render()

        document.getElementById('stop').addEventListener('click', function(){
            if(velocityMultiplier === 0) {return;}
            savedVelocity = velocityMultiplier;
            velocityMultiplier = 0;
        })

        document.getElementById('resume').addEventListener('click', function(){
            velocityMultiplier = savedVelocity;
        })

        document.getElementById('reset').addEventListener('click', function(){
                nodeArray = []
                spawnNodes(nodeCount)
        })

        document.getElementById('download').addEventListener('click', function(){
            let can = document.getElementById("constcanvas");
            let canvasUrl = can.toDataURL();
            const canvasElement = document.createElement('canvas');
            canvasElement.href = canvasUrl;
            canvasElement.download = "connections.png";
            canvasElement.click();
        })
    }, [])

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
        nodeline = newValue;
    }

    return(
        <>
            <canvas 
                ref={canvas} 
                id="constcanvas"
                position='absolute'
                height='100%'
                width='100%'
                style={{
                    background: "#000000"
                }}
            />
            <br/>
            <input type="button" value="STOP!" id="stop"/>
            <input type="button" value="RESUME!" id="resume"/>
            <input type="button" value="RESET!" id="reset"/>
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
                onChange={densityUpdate}
                style={{
                    width: getWidth()
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
                    width: getWidth()
                }}
            />
            <br/>
            Line Proximity:
            <br/>
            <Slider
                aria-label='lineproximity'
                getAriaLabel={sliderLabel}
                valueLabelDisplay='auto'
                marks={true}
                track={false}
                min={50}
                max={150}
                defaultValue={70}
                onChange={nodeLineUpdate}
                style={{
                    width: getWidth()
                }}
            />
        </>
    )
}