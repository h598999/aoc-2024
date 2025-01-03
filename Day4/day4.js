import { readFile } from 'fs';

readFile('input-day4.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    /** @type{Array<String>} */
        const lines = data.trim().split('\n');
    /** @type{Array<String>} */
        const dynamicArray = []
    for (let i = 0; i<lines.length; i++){
        dynamicArray[i] = [];
        for (let o = 0; o<lines[i].length; o++){
            dynamicArray[i][o] = lines[i][o];
        }
    }
    /** @type{number} */
        let numOfXMAS1 = 0;
    /** @type{number} */
        let numOfXMAS2 = 0;
    for (let i = 0; i<dynamicArray.length; i++){
        for (let j = 0; j<dynamicArray[i].length; j++){
            numOfXMAS1 += checkForXmas(i,j,dynamicArray);
            numOfXMAS2 += checkForXmas2(i,j,dynamicArray);
        }
    }
    console.log(" num of xmas: " + numOfXMAS1)
    console.log(" num of x-mas: " + numOfXMAS2)
});
function checkForXmas(i, j, dynamicArray) {
    /** @type{number} */
        let numOfXmas = 0;

    if (j <= dynamicArray[i].length - 4) { 
        const rowSlice = dynamicArray[i].slice(j, j + 4); 
        /** @type{string} */
            const stringFromSlice = rowSlice.join('');
        if (stringFromSlice === 'XMAS' || stringFromSlice === 'SAMX') {
            numOfXmas++;
        }
    }

    if (i <= dynamicArray.length - 4) { 
        /** @type{string} */
            let downString = '';
        for (let row = i; row < i + 4; row++) { 
            downString += dynamicArray[row][j];
        }
        if (downString === 'XMAS' || downString === 'SAMX') {
            numOfXmas++;
        }
    }
    if (i <= dynamicArray.length - 4 && j <= dynamicArray[i].length - 4) { 
        /** @type{string} */
            let diagonalString = '';
        for (let step = 0; step < 4; step++) {
            diagonalString += dynamicArray[i + step][j + step]; 
        }
        if (diagonalString === 'XMAS' || diagonalString === 'SAMX') {
            numOfXmas++;
        }
    }
    if (i <= dynamicArray.length - 4 && j >= 3) { 
        let horizontalDownBackString = '';
        for (let step = 0; step < 4; step++) {
            const row = i + step;
            const col = j - step; 
            horizontalDownBackString += dynamicArray[row][col];
        }
        if (horizontalDownBackString === 'XMAS' || horizontalDownBackString === 'SAMX') {
            numOfXmas++;
        }
    }
    return numOfXmas;
}

function checkForXmas2(i, j, dynamicArray) {
    /** @type{number} */
        let numOfXmas = 0;
    if (i <= dynamicArray.length - 3 && j <= dynamicArray[i].length - 3) {
        let diagonalString = '';
        for (let step = 0; step < 3; step++) {
            diagonalString += dynamicArray[i + step][j + step]; 
        }
        if (diagonalString === 'MAS' || diagonalString === 'SAM') {
            if (i <= dynamicArray.length - 3 && j + 2 >= 2) {
                let crossDiagonalString = '';
                for (let step = 0; step < 3; step++) {
                    const row = i + step;
                    const col = j + 2 - step; 
                    crossDiagonalString += dynamicArray[row][col];
                }
                if (crossDiagonalString === 'MAS' || crossDiagonalString === 'SAM') {
                    numOfXmas++;
                }
            }
        }
    }
    return numOfXmas;
}
