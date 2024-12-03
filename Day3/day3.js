import { readFile } from 'fs';

readFile('input-day3.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    /** @type{Array<String>} */
        const lines = data.trim().split('\n');
    /** @type{RegExp} */
        const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

    let total = 0;
    let mult = true;
    lines.forEach(line => {
        console.log(line);
        let matches;
        while ((matches = regex.exec(line)) !== null) { 
            console.log(matches)
            if (matches[0].startsWith("mul") && mult){
                const num1 = parseInt(matches[1], 10); 
                const num2 = parseInt(matches[2], 10);
                total += num1 * num2; 
            } else if(matches[0] === "do()"){
                console.log("do")
                mult = true;
            } else if (matches[0] === "don't()"){
                console.log("dont")
                mult = false;
            }
        }
    });
    console.log(total);
});
