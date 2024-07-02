import React from 'react'
import { Slider } from '@mui/material'

function label(value){
    return `${value}`
}

export function Sphere(){
    const canvas = React.createRef()

    const getSize = () => {
        //if(window.innerHeight < window.innerWidth) return window.innerHeight * 0.6
        //return window.innerWidth * 0.6
        return 500
    }

    const [radius, setRadius] = React.useState(getSize()/2)

    React.useEffect(() => {
        let c = canvas.current.getContext('2d')
        let cubeArray = []
        let debugPointArray = []

        c.canvas.width = getSize()
        c.canvas.height = getSize()

        class Cube{
            constructor(x, y, num, layer){
                this.x = x
                this.y = y
                this.num = num
                this.layer = layer
            }

            drawSquare(){
            }
        }

        class DebugPoint{
            constructor(x, y){
                this.x = x
                this.y = y
            }

            drawPoint(){
                c.beginPath()
                c.arc(this.x, this.y, 1, 0, Math.PI*2)
                c.strokeStyle = "#FFFFFF"
                c.stroke()
            }
        }

        const genCubes = () => {
            for(let i = 0; i < 8; i++){ //Layer 1

            }
        }

        const debugDrawCircle = () => {
            c.beginPath()
            c.arc(radius, radius, radius, 0, Math.PI*2)
            c.strokeStyle = "#FF0000"
            c.stroke()
        }

        const debugDrawVP = () => {
            debugPointArray.push(new DebugPoint(radius, radius))
            for(let i = 0; i < debugPointArray.length; i++){
                debugPointArray[i].drawPoint()
            }
        }

        const anchorCube = () => {
            c.beginPath()
            c.moveTo(radius * 0.75,  radius * 0.75)
            c.lineTo(radius * 1.25, radius * 0.75)
            c.lineTo(radius * 1.25, radius * 1.25)
            c.lineTo(radius * 0.75, radius * 1.25)
            c.lineTo(radius * 0.75, radius * 0.75)
            c.strokeStyle = "#FFFFFF"
            c.lineWidth = "2px"
            c.stroke()
        }

        anchorCube()
        debugDrawVP()
        debugDrawCircle()

    })

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
            >

            </canvas>
        </>
    )
}