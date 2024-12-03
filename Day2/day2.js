import { readFile } from 'fs';

readFile('input-day2.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const lines = data.trim().split('\n');

    let safeCounter = 0;
    for (let i = 0; i<lines.length; i++){
        let parts = lines[i].split(' ').map(Number);
        let decreasing = parts[0] > parts[1]
        let increment = checkReport(parts, 1, decreasing);
        if (!increment){
            safeCounter += testSubReport(parts, increment)
        } else{
            safeCounter += 1;
        }
    }
    console.log(safeCounter);

});

/**
    *@param {Array<Number>} parts
    *@param {Number} j 
    *@param {Boolean}  decreasing 
    */
    function checkReport(parts, j, decreasing) {
        if (j == parts.length){
            console.log(" " + parts + " is good")
            return true;
        }
        let difference = parts[j] - parts[j-1]

        if ((decreasing && difference > 0) || (!decreasing && difference < 0)){
            return 0;
        }
        let absDifference = Math.abs(difference)
        if (absDifference < 1 || absDifference > 3 ||absDifference === 0){
            return 0;
        }
        return checkReport(parts, (j+1), decreasing)
    }

function testSubReport(parts, j){
    for (let i = 0; i<parts.length; i++) {
        let subReport = parts.toSpliced(i, 1);
        let decreasing = subReport[0] > subReport[1]
        if (checkReport(subReport, 1, decreasing))
            return true;
    }
    return false;
}

