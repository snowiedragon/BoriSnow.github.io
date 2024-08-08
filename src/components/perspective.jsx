import React from 'react';
import { Slider } from '@mui/material';

function label(value){
    return `${value}`;
}

export function Perspective(){
    const canvas = React.useRef();
    
    function getWidth(){
        return window.innerWidth * 0.6
    }
    function getHeight(){
        return window.innerHeight * 0.6
    }

    const [horizonLine, setHorizonLine] = React.useState(Math.round(getHeight() * 0.25))
    const [vanishingDistance, setVanishingDistance] = React.useState(30)
    const [cubeProportion, setCubeProportion] = React.useState(Math.round((1/((getWidth()/2)/100))*25))
    const [spacing, setSpacing] = React.useState(Math.round(getWidth()*0.08))
    const initialPoint = [getWidth()/2, getHeight()*0.65]
    const vertexArray = []

    React.useEffect(() => {
        let c = canvas.current.getContext('2d')

        let vanishL = [0 - vanishingDistance, horizonLine]
        let vanishR = [getWidth() + vanishingDistance, horizonLine]
        c.canvas.width = getWidth()
        c.canvas.height = getHeight()
        console.log("Width: [" + getWidth() + "] Height: [" + getHeight() + "]")
        
        const gVanish = c.createLinearGradient(initialPoint[0], initialPoint[1], initialPoint[0], horizonLine)
        gVanish.addColorStop(0, "white")
        gVanish.addColorStop(1, "transparent")

        class Vertex{
            constructor(x, y){
                this.x = x
                this.y = y
            }

            drawVerticalLine(endPoint){
                const gVert = c.createLinearGradient(this.x, this.y, this.x, getHeight())
                gVert.addColorStop(0, "white")
                gVert.addColorStop(1, "transparent")
                c.beginPath()
                c.lineWidth = "4px"
                if(endPoint == null){
                    c.moveTo(this.x, this.y)
                    c.lineTo(this.x, getHeight())
                    c.strokeStyle = gVert
                    c.stroke()
                }
                else{
                    c.moveTo(this.x, this.y)
                    c.lineTo(this.x, endPoint)
                    c.strokeStyle = gVanish
                    c.stroke()
                }
            }

            drawLine(point){
                point = new Vertex(point[0], point[1])
                c.beginPath()
                c.moveTo(this.x, this.y)
                c.lineTo(point.x, point.y)
                c.strokeStyle = gVanish
                c.lineWidth = "4px"
                c.stroke()
                c.closePath()
            }

            findIntersect(point){
                let m1, m2
                if(this.x < initialPoint[0]){
                    m1 = (this.y - vanishR[1])/(this.x - vanishR[0])
                    m2 = (point.y - vanishL[1])/(point.x - vanishL[0])
                }
                else{
                    m1 = (this.y - vanishL[1])/(this.x - vanishL[0])
                    m2 = (point.y - vanishR[1])/(point.x - vanishR[0])
                }
                let b1 = this.y - (m1 * this.x)
                let b2 = point.y - (m2 * point.x)
                return [(b2 - b1)/(m1 - m2), m1 * ((b2 - b1)/(m1 - m2)) + b1]
            }

            drawInnerLine(index, prevPoint){
                let lastPoint = new Vertex(this.x, this.y)
                for(let i = index; i < vertexArray.length; i += 4){
                    let innerVertex = this.findIntersect(vertexArray[i])
                    lastPoint.drawLine(innerVertex)
                    if(index === 2 && prevPoint){
                        innerVertex = new Vertex(innerVertex[0], innerVertex[1])
                        innerVertex.drawVerticalLine(lineEqn(innerVertex.x, vanishR, [prevPoint.x, prevPoint.y]))
                    }
                    if(i + 2 >= vertexArray.length) return
                    let nextPoint = this.findIntersect(vertexArray[i + 2])
                    lastPoint = new Vertex(nextPoint[0], nextPoint[1])
                    if(index === 2){
                        lastPoint.drawVerticalLine(lineEqn(lastPoint.x, vanishL, [vertexArray[i].x, vertexArray[i].y]))
                    }
                }
            }
        }

        function drawHorizon(){
            if(horizonLine < initialPoint[1]){
                c.clearRect(0, 0, getWidth(), getHeight());
                c.beginPath();
                c.moveTo(vanishL[0], vanishL[1]);
                c.lineTo(vanishR[0], vanishR[1]);
                c.strokeStyle = "#808080";
                c.lineWidth = "2px";
                c.stroke();
                c.closePath();
            }
        }

        function lineEqn(x, vanish, anchor){
            let m = (vanish[1] - anchor[1])/(vanish[0] - anchor[0])
            let b = anchor[1] - (m * anchor[0])
            return m * x + b
        }

        function genVertex(){
            vertexArray.push(new Vertex(initialPoint[0], initialPoint[1]))
            let x = initialPoint[0], y = initialPoint[1]
            let difference = 600
            let proportion = cubeProportion, spaces = spacing
            while(x > vanishL[0]){
                x -= (difference/proportion)
                y = lineEqn(x, vanishL, initialPoint)
                difference -= difference/proportion
                if(x < vanishL[0]) break
                vertexArray.push(new Vertex(x, y))
                vertexArray.push(new Vertex(getWidth() - x, y))
                x -= (spaces/proportion)
                y = lineEqn(x, vanishL, initialPoint)
                spaces -= spaces/proportion
                proportion++
                if(x < vanishL[0]) break
                vertexArray.push(new Vertex(x, y))
                vertexArray.push(new Vertex(getWidth() - x, y))
            }
        }

        function drawBoxes(){
            vertexArray[0].drawLine([vertexArray[1].x, vertexArray[1].y])
            vertexArray[0].drawLine([vertexArray[2].x, vertexArray[2].y])
            vertexArray[0].drawVerticalLine()
            let next, count = 1
            for(let i = 1; i < vertexArray.length; i++){
                next = i + 2
                if(next >= vertexArray.length) return
                if(count === 5) count = 1
                if(horizonLine > initialPoint[1]){
                    if(count === 3 || count === 4){
                        vertexArray[i].drawLine([vertexArray[next].x, vertexArray[next].y])
                        if(count === 3) vertexArray[i].drawLine([vertexArray[i - 2].x, lineEqn(vertexArray[i - 2].x, vanishR, [vertexArray[i].x, vertexArray[i].y])])
                        else vertexArray[i].drawLine([vertexArray[i - 2].x, lineEqn(vertexArray[i - 2].x, vanishL, [vertexArray[i].x, vertexArray[i].y])])
                    }
                }
                else if(count === 1){
                    //vertexArray[i].drawLine([vanishR[0], vanishR[1]])
                    vertexArray[i].drawInnerLine(2)
                }
                else if(count === 2){
                    //vertexArray[i].drawLine([vanishL[0], vanishL[1]])
                    vertexArray[i].drawInnerLine(1)
                }
                else if(count === 3){
                    vertexArray[i].drawLine([vertexArray[next].x, vertexArray[next].y])
                    //vertexArray[i].drawLine([vanishR[0], vanishR[1]])
                    vertexArray[i].drawInnerLine(2, vertexArray[i - 2])
                }
                else if(count === 4){
                    vertexArray[i].drawLine([vertexArray[next].x, vertexArray[next].y])
                    //vertexArray[i].drawLine([vanishL[0], vanishL[1]])
                    vertexArray[i].drawInnerLine(1)
                }
                vertexArray[i].drawVerticalLine(null)
                count++                
            }
        }

        drawHorizon()
        genVertex()
        drawBoxes()

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

    function spacingUpdate(event, newValue){
        setSpacing (newValue);
    }

    function horizonUpdate(event, newValue){
        setHorizonLine (newValue);
    }
    
    function vanishingDistanceUpdate(event, newValue){
        setVanishingDistance (newValue);
    }

    function cubeProportionUpdate(event, newValue){
        setCubeProportion (newValue);
    }

    return(
        <>
            <canvas
                ref={canvas}
                id="perspectivecanvas"
                height='100%'
                width='100%'
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
                track={false}
                min={Math.round(getWidth()*0.1)}
                max={200}
                value={spacing}
                onChange={spacingUpdate}
                style={{
                    width: getWidth()
                }}
            />
            <br/>
            Horizon Line: {horizonLine}
            <br/>
            <Slider
                aria-label='horizonLine'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                track={false}
                min={0}
                max={initialPoint[0]}
                value={horizonLine}
                onChange={horizonUpdate}
                style={{
                    width: getWidth()
                }}
            />
            <br/>
            Cube Proportion: {cubeProportion}
            <br/>
            <Slider
                aria-label='cubeProportion'
                getAriaLabel={label}
                valueLabelDisplay='auto'
                step={0.01}
                track={false}
                min={Math.round((1/((getWidth()/2)/100))*25) - 1}
                max={Math.round((1/((getWidth()/2)/100))*25) + 1}
                value={cubeProportion}
                onChange={cubeProportionUpdate}
                style={{
                    width: getWidth()
                }}
            />
        </>
    )

}