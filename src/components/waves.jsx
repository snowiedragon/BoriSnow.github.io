import { Slider } from '@mui/material';
import React from 'react';

export function Waves () {
    const canvas = React.createRef();
    const [column, setColumn] = React.useState(8);
    const [row, setRow] = React.useState(6);
    const [wavePoints, setWavePoints] = React.useState(30);
    const pointArray = [];
    const edgeArray = [];
    let pointIndex = [0, 0];
    let pointDistance = [1000, 1000];
    let tempIndex;
    let tempDistance;
    let x;
    let y;

    function sliderLabel(value){
        return `${value}`;
    }

    React.useEffect(() => {
        let c = canvas.current.getContext('2d');
        
        class Point {
            constructor(x, y){
                this.x = x;
                this.y = y;
            }

            debugDrawPoints(){
                c.beginPath();
                c.fillRect(this.x, this.y, 3, 3);
                c.stroke();
            }

            debugDrawEdgePoints(){
                c.beginPath();
                c.arc(this.x, this.y, 5, 0, Math.PI*2);
                c.stroke();
            }

            draw(){
                let pointIndex = [];
                let pointDistance = [];
                for(let i = 0; i < pointArray.length; i++){
                    let distance = Math.sqrt((this.x - pointArray[i].x)*(this.x - pointArray[i].x)+(this.y - pointArray[i].y)*(this.y - pointArray[i].y))
                    if(pointDistance.length < 2 && distance !== 0){
                        pointIndex.push(i);
                        pointDistance.push(distance);
                    }
                    if(distance < pointDistance[0] && i >= 2 && distance !== 0){
                        tempDistance = pointDistance[0];
                        pointDistance[0] = distance;
                        tempIndex = pointIndex[0];
                        pointIndex[0] = i;
                        if(distance < pointDistance[1]){
                            pointDistance[1] = tempDistance;
                            pointIndex[1] = tempIndex;
                        }
                    }
                }
                c.beginPath();
                c.moveTo(this.x, this.y)
                let index1 = pointIndex[0];
                let index2 = pointIndex[1];
                c.lineTo(pointArray[index1].x, pointArray[index1].y);
                c.bezierCurveTo(pointArray[index1].x, pointArray[index1].y, this.x, this.y, pointArray[index2].x, pointArray[index2].y);
                c.lineTo(pointArray[index2].x, pointArray[index2].y);
                c.fill();
                c.closePath();
            }
        }

        const spawnWaves = () => {
            c.clearRect(0, 0, 1000, 500);
            let columnStep = 1000/column;
            let rowStep = 500/row;
            for(let i = 1; i < column; i++){
                if(Math.random() <= 0.45){
                    edgeArray.push(new Point(columnStep*i, 0))
                }
                if(Math.random() <= 0.45){
                    edgeArray.push(new Point(columnStep*i, 500))
                }
            }
            for(let i = 1; i < row; i++){
                if( Math.random() <= 0.4){
                    edgeArray.push(new Point(0, rowStep*i))
                }
                if( Math.random() <= 0.4){
                    edgeArray.push(new Point(1000, rowStep*i))
                }
            }

            
            for(let i = 0; i < wavePoints; i++){
                let x = Math.random() * (960) + 20;
                let y = Math.random() * (460) + 20;
                pointArray.push(new Point(x, y));
                pointArray[i].debugDrawPoints();
            }

            for (let i = 0; i < edgeArray.length; i++){
                edgeArray[i].debugDrawEdgePoints();
            }
        }

        spawnWaves();

        const render = () => {
            //c.clearRect(0, 0, 1000, 500);
            for(let i = 0; i < pointArray.length; i++){
                pointArray[i].draw();
            }
        }

        render();

    })

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
        </>
    )
}