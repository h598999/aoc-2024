import { readFile } from "fs";

readFile('./input-day11.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const lines = data.trim();
    solve(lines)
});

/**
    *@param {String} line 
    *@returns {String}
    */
    function convertStones(line){
        let numArr = [];
        for (let i = 0; i<line.length; i++){
            if (line[i] == 0){
                numArr.push('1');
            }else if (line[i].length % 2 == 0){
                let left = line[i].slice(0, line[i].length/2);
                let right = line[i].slice((line[i].length/2), line[i].length);
                numArr.push(isZero(left))
                numArr.push(isZero(right))
            }else{
                let num = parseInt(line[i]) * 2024;
                let string = num.toString();
                numArr.push(string);
            }
        } 
        return numArr;
    }

/**
    *@param {String} line 
    *@returns {Array<Number>}
    */
function convertToWords(line){
   return line
    .trim()
    .split(/\s+/)
}

/**
    *@param {String} line 
    */
function isZero(line){
    let allZeros = true;
    let string = '';
    for (let i = 0; i<line.length; i++){
        if (line[i] === '0' && allZeros){
            continue;
        } else {
          allZeros = false;
          string += line[i];
        }
    }
    console.log(string)
    if (allZeros){
        return '0';
    }
    return string;
}

function solve (input) {
    let stones = input.split(' ').map(Number);

    const lenmap = {};
    const getLen = (n, it) => lenmap[n]?.[it];
    const setLen = (n, it, len) => {
        if (!lenmap[n]) lenmap[n] = { [it]: len };
        else lenmap[n][it] = len;
    }

    const getStoneCount = (stone, blinks) => {
        if (blinks === 0) return 1;

        // check cache if there is known information of how many stones this stone splits into after given amount of blinks
        const len = getLen(stone, blinks);
        if (len) return len;

        // no info in cache, calculate it and store in cache
        let result = null;
        if (stone === 0) {
            result = getStoneCount(1, blinks - 1);
        } else if (stone.toString().length % 2 === 0) {
            let str = stone.toString();
            result = getStoneCount(Number(str.slice(0, str.length / 2)), blinks - 1)
                   + getStoneCount(Number(str.slice(str.length / 2)), blinks - 1);
        } else {
            result = getStoneCount(stone * 2024, blinks - 1);
        }
        
        setLen(stone, blinks, result);
        return result;
    }

    console.log('Part 1:', stones.map(x => getStoneCount(x, 25)).reduce((p, c) => p += c, 0));
    console.log('Part 2:', stones.map(x => getStoneCount(x, 75)).reduce((p, c) => p += c, 0));
}
