import { readFile } from 'fs';

readFile('test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }
    /**@type{Array<String>} */
        const lines = data.split('\n');
    /**@type{String} */
        let list1 = []
    /**@type{String} */
        let list2 = []
    lines.forEach((line) => { //O(n/2)
        const parts = line.trim().split("   ");
        if (parts.length >= 2) {
            list1.push(parts[0]); 
            list2.push(parts[1]); 
            
        }
    });

    let sortedList1 = list1.sort(); // -> O(n log n)
    let sortedList2 = list2.sort(); // -> O(n log n);

    let count = 0;
    for (let i = 0; i<sortedList1.length; i++){
        count += Math.abs(sortedList1[i] - sortedList2[i])
    }
    console.log("Part1: " + count);
    
    count = 0;
    let j = 0;
    let similarCounter = 0;
    const map = new Map();
    for (let i = 0; i<sortedList1.length;){ // -> O(n)
        if (map.has(sortedList1[i])){
            count += map.get(sortedList1[i]);
            i++;
        }
        else if (sortedList1[i] == sortedList2[j]){
            similarCounter++;
            j++;
        } else if (sortedList1[i] > sortedList2[j]){
            j++;
            similarCounter = 0;
        } else {
            if (similarCounter != 0){
                map.set(sortedList1[i], (similarCounter * sortedList1[i]));
                count += (similarCounter * sortedList1[i]);
            }
            i++;
            similarCounter = 0;
        }
    }
    console.log("Part2: " + count);
});
