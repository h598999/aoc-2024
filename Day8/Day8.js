import { readFile } from 'fs';

readFile('./input-day8.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const lines = data.trim().split('\n');
    const regex = /[a-zA-Z]|[0-9]/g

    let map = new Map()
    for (let i = 0; i<lines.length; i++){
        for (let o = 0; o < lines[i].length; o++){
            if (lines[i][o].match(regex)){
                if (map.has(lines[i][o])){
                    map.get(lines[i][o]).push([i,o])
                }else{
                    map.set(lines[i][o], [[i,o]])
                }
            }
        }
    }
    let antinode = calculateDistance(map, lines[0].length, lines.length)
    console.log(drawAntinodes(lines, antinode))
});

/**
    *@param {Map} map
    */
    function calculateDistance(map, Xbound, Ybound){
        let counter = 0;
        let positionAnti = new Set();
        for (const [key,values] of map){
            for (let i = 0; i<values.length; i++){
                let pos = values[i]
                for (let o = 0; o<values.length; o++){
                    if (values[o][0]>= 0 && values[o][0]< Ybound && values[o][1]>= 0 && values[o][1]<Xbound){
                        const posKey = `[${values[o][0]},${values[o][1]}]`
                        if (!positionAnti.has(posKey)){
                            positionAnti.add(posKey)
                            counter++
                        }
                    }
                    if (values[o] !== pos){
                        let diffY = pos[0] - values[o][0]
                        let diffX = pos[1] - values[o][1]
                        let posy = values[i][0] + diffY;
                        let posx = values[i][1] + diffX;
                        let newPos = [posy, posx]
                        let outofbounds = false
                        {
                            while(!outofbounds){
                                if (posy >= 0 && posy < Ybound && posx >= 0 && posx <Xbound){
                                    const posKey = `[${newPos[0]},${newPos[1]}]`
                                    if (!positionAnti.has(posKey)){
                                        positionAnti.add(posKey)
                                        counter++
                                    }
                                } else{
                                    outofbounds = true
                                }
                                posy += diffY
                                posx += diffX
                                newPos = [posy, posx]
                                console.log(newPos)
                            }
                        }
                    }
                }
            }
        }
        console.log(positionAnti)
        console.log(counter)
        return positionAnti;
    }

function drawAntinodes(lines, positionAnti) {
    // Convert each line into a character array for easy modification
    let mapArray = lines.map(line => line.split(''));

    // Iterate through the antinodes set
    for (const posKey of positionAnti) {
        // posKey is something like "[y,x]"; extract the numbers
        const match = posKey.match(/\[(\d+),(\d+)\]/);
        if (!match) continue;
        const y = parseInt(match[1], 10);
        const x = parseInt(match[2], 10);

        // Place '#' at the position
        // Make sure the position is within bounds
        if (y >= 0 && y < mapArray.length && x >= 0 && x < mapArray[0].length) {
            mapArray[y][x] = '#';
        }
    }

    // Convert the character arrays back into strings
    const modifiedLines = mapArray.map(row => row.join(''));

    // Print the result to the console or return it
    // console.log(modifiedLines.join('\n'));
    return modifiedLines;
}


