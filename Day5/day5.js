import { readFile } from 'fs';

readFile('input-day5.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    /** @type{Array<String>} */
        const lines = data.trim().split('\n');
    let isEmpty = false; 
    let updates = [];
    let rules = new Map();
    let j = 0;

    // This collects the rules in a map<Key, set()> where the key 
    // holds its related elements, the related elements to a key should all 
    // be visited before the key for an update to be valid
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == null || lines[i].trim() === '') {
            isEmpty = true;
            continue; 
        }

        if (!isEmpty) {

            let line = lines[i].split("|");
            if (!rules.has(line[1])) { 
                rules.set(line[1], new Set());
            }
            rules.get(line[1]).add(line[0]);
        } else {

            let line = lines[i].split(",");
            updates[j] = [];
            for (let o = 0; o < line.length; o++) {
                updates[j][o] = line[o];
            }
            j++;
        }
    }
    let sum = 0;
    let brokesum = 0;
    for (let i = 0; i<updates.length; i++){
        let visited = new Set();

        const subMap = new Map();

        //Here we filter out only the rules that are relevant to this update
        //since a rule only counts if an the element is in the update
        //for example if 75 has 98, the updated cannot fail because 98 was not visited
        //if 98 isnt a part of the update
        for (const key of updates[i]) {
            if (rules.has(key)) {
                const originalSet = rules.get(key);
                const filteredSet = new Set(
                    [...originalSet].filter(value => updates[i].includes(value))
                );

                if (filteredSet.size > 0) {
                    subMap.set(key, filteredSet);
                }
            }
        }
        let approved = true;
        // Go throuhg an update, for every visited value, check its related values
        // check for every related value that it has been visited
        // If it has not been visited fix it and add the middle number -> Part 2
        // If everything checks out add the midlle number of updates[i]
        for (let o = 0; o<updates[i].length; o++){
            visited.add(updates[i][o])
            if (subMap.has(updates[i][o])){
                const ruleSet = subMap.get(updates[i][o]);
                let allVisited = true; 

                for (const n of ruleSet) {
                    if (!visited.has(n)) {
                        fixOrdering(subMap,updates[i])
                        brokesum += parseInt(updates[i][Math.floor((updates[i].length)/2)])
                        allVisited = false;
                        approved = false;
                        break; 
                    }
                }

                if (!allVisited) {
                    break; 
                } 
            }
        }
        if (approved){
            console.log("Updates i: " + updates[i][Math.floor((updates[i].length)/2)])
            sum += parseInt(updates[i][Math.floor((updates[i].length)/2)])
        }
    }
    console.log(sum)
    console.log(brokesum)
});

/**
 * @param {Map<number, Set<number>>} rules
 * @param {Array<number>} update
 */
function fixOrdering(rules, update) {
    //Goes through the entire array 2D
    for (let i = 0; i < update.length; i++) {
        //Get the current number we are checking for
        const current = update[i];
        //Cheks the rules for the current index, the current (key) has to be after all of its values
        if (rules.has(current)) {
            const dependencies = rules.get(current); 
            //Checks for every dependency if it is in front of it
            for (const dep of dependencies) {
                const depIndex = update.indexOf(dep);
                //If it is after the key we place it in front of key value
                if (depIndex > i) {
                    update.splice(i, 1);
                    update.splice(depIndex, 0, current);
                    i--;
                    break;
                }
            }
        }
    }
}
