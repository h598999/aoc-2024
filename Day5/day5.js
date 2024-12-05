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
    console.log(rules);
    let sum = 0;
    let brokesum = 0;
    for (let i = 0; i<updates.length; i++){
        let visited = new Set();

        const subMap = new Map();

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
        console.log("Submap")
        console.log(subMap)
        for (let o = 0; o<updates[i].length; o++){
            visited.add(updates[i][o])
            if (subMap.has(updates[i][o]) && updates[i]){
                const ruleSet = subMap.get(updates[i][o]);
                let allVisited = true; 

                for (const n of ruleSet) {
                    if (!visited.has(n)) {
                        console.log('Has not visited ' + n)
                        console.log('Failed ' + updates[i]);
                        fixOrdering(subMap,updates[i])
                        console.log('Fixed: ' + updates[i])
                        console.log("Updates i: " + updates[i][Math.floor((updates[i].length)/2)])
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
    for (let i = 0; i < update.length; i++) {
        const current = update[i];
        if (rules.has(current)) {
            const dependencies = rules.get(current); 
            for (const dep of dependencies) {
                const depIndex = update.indexOf(dep);
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
