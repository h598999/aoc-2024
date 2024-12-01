const fs = require('fs');

fs.readFile('test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }
    /**@type{Array<String>} */
        const lines = data.split(/\r?\n/)
    /**@type{String} */
        let list1 = []
    /**@type{String} */
        let list2 = []
    lines.forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
            list1.push(parts[0]); 
            list2.push(parts[1]); 
            
        }
    });

    let sortedList1 = list1.sort();
    let sortedList2 = list2.sort();

    // let count = 0;
    // for (let i = 0; i<sortedList1.length; i++){
    //     count += Math.abs(sortedList1[i] - sortedList2[i])
    // }
    // console.log(count);
    //
    let count = 0;
    let j = 0;
    let similarCounter = 0;
    const map = new Map();
    for (let i = 0; i<sortedList1.length;){
        if (map.has(sortedList1[i])){
            console.log("Adding " + map.get(sortedList1[i]) + " because we know " + sortedList1[i] + " appears " + map.get(sortedList1[i])/sortedList1[i] + " times in the list");
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
                console.log(sortedList1[i] + " appears " + similarCounter + " times in the right list");
                console.log("Adding " + (similarCounter * sortedList1[i]));
                map.set(sortedList1[i], (similarCounter * sortedList1[i]));
                count += (similarCounter * sortedList1[i]);
            }
            i++;
            similarCounter = 0;
        }
    }
    console.log(count);
});
