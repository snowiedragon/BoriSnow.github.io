import { Slider } from '@mui/material';
import React from 'react';

//setTimeout might help

export function Growth () {
    const canvas = React.createRef();
    //const [treeDensity, setTreeDensity] = React.useState(8);
    const [branchStep, setBranchStep] = React.useState(5); //number of branch layers to generate
    const [branchCount, setBranchCount] = React.useState(5); //maximum number of branches to generate each step
    const [initialBranchLength, setInitialBranchLength] = React.useState(50)
    const treeArray = []; //store the base of each tree
    let stepCount = 0;
    let currentBranchCount;
    let branchLength;

        function label(value){
            return `${value}`;
        }

        React.useEffect(() => {
            let c = canvas.current.getContext('2d');
            c.clearRect(0, 0, 1000, 500);

            class Branch {
                constructor(x, y, x2, y2){
                    this.x = x;
                    this.y = y;
                    this.x2 = x2;
                    this.y2 = y2;
                }
            }

            const spawnTrees = () => {
                for(let i = 0; i < treeDensity; i++){
                    let x = 500;
                    let x2 = 500;
                    let y = 500;
                    let y2 = y - initialBranchLength;
                    treeArray.push(new Branch (x, y, x2, y2));
                    while (stepCount <= branchStep){
                        currentBranchCount = Math.floor(Math.random() * (branchCount) + 1)
                        for (let m = 0; m < currentBranchCount; m++){
                            x = x2;
                            y = y2;
                            
                            branchLength = branchLength - (branchLength * 0.66);
                        }
                        stepCount++;
                    }

                }
            }

            spawnTrees();

            const render = () => {
                for (let i = 0; i < trunkArray.length; i++){
                    trunkArray[i].growTree();
                }
                stepCount++;
                if(stepCount === branchStep) { return; }
                requestAnimationFrame(render);
            }

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