import { readFile } from "fs";

readFile('./input-day10.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const lines = data.trim().split('\n')
    let potentialTrailheads = findPotentialTrailHeads(lines);
    let counter = 0;
    potentialTrailheads.forEach(p => {
        let foundNines = new Set();
        counter += findTrails(lines, p, [], foundNines)
        console.log("Trailhead at " + p[0] + " " + p[1] + " has value " + foundNines.size);
    })
    console.log(counter)
});

/**
    *@param {Array<String>} lines 
    *@param {Array<Number>} position
    *@param {Array<String>} visited 
    *@param {Set<String>} foundNines
    */
    function findTrails(lines, position, visited, foundNines){
        let i = position[0];
        let j = position[1];
        let valueCurrentPos = parseInt(lines[i][j]);
        visited = [`${i},${j}`,...visited];

        let neighbours = [
            [i+1,j],
            [i-1,j],
            [i,j+1],
            [i,j-1]
        ]
        let counter = 0;
        for (const p of neighbours) {
            if (p[0] < 0 || p[0] >= lines.length || p[1] < 0 || p[1] >= lines[p[0]].length) {
                continue; 
            }
            let valNewPos = parseInt(lines[p[0]][p[1]]);
            if (visited.includes(`${p[0]},${p[1]}`)) {
                continue;
            }

            let difference = (valNewPos - valueCurrentPos);

            if (difference === 1 && valNewPos === 9) {
                foundNines.add(`${p[0]},${p[1]}`);
                counter++;
                continue;
            }
            if (difference === 1) {
                counter += findTrails(lines, p, visited, foundNines);
                continue;
            }
        }
        return counter;
    }

function findPotentialTrailHeads(lines){
    let trailHeads = [];
    for (let i = 0; i<lines.length; i++){
        for (let j = 0; j<lines[i].length; j++){
            if (lines[i][j] === '0'){
                trailHeads.push([i,j])
            }
        }
    }
    return trailHeads
}
