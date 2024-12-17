import { readFile } from "fs";

readFile('./input-day9.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    // Treat the entire trimmed input as a single line
    const line = data.trim()
    let convertedLine = convertLine(line);
    console.log(convertedLine.join(''))
    let id8 = findFileById(convertedLine, 8);
    let sizeid8 = findSizeOfFileBlock(convertedLine, 8, id8)
    let freeSpace = findFreeSpaceOfSize(convertedLine, sizeid8)
    console.log(convertedLine.length)
    console.log(id8)
    console.log(sizeid8)
    console.log(freeSpace)
    let movedLine = moveBlocks(convertedLine)
    console.log(calculateCheckSum(movedLine))
});

/**
    * @param {Array} line
    */
    function moveBlocks(line){
        let id = line[findFile(line)];
        let startFileBlock = findFileById(line, id);
        let sizeFileBlock = findSizeOfFileBlock(line, id, startFileBlock)
        let freeSpace = findFreeSpaceOfSize(line, sizeFileBlock)
        while (id > 0){
            if (freeSpace > 0 && freeSpace < startFileBlock){
                console.log(id + " Can be moved")
                let counter = 0;
                while(counter < sizeFileBlock){
                    line[freeSpace+counter] = line[startFileBlock+counter]
                    line[startFileBlock+counter] = '.'
                    counter++;
                }
            } else {
                console.log(id + " Can not be moved")
            }
            console.log(line.join(''))
            id = id - 1;
            startFileBlock = findFileById(line, id);
            sizeFileBlock = findSizeOfFileBlock(line, id, startFileBlock)
            freeSpace = findFreeSpaceOfSize(line, sizeFileBlock)
        }
        return line
    }

/**
    *@param {Array} line 
    *@param {Number} line 
    */
function findFileById(line, id){
    for (let i = 0; i<line.length; i++){
        if (line[i] === id){
            return i;
        }
    }
    return -1;

}

/**
    *@param {Array} line 
    */
function findSizeOfFileBlock(line,id, index){
    for (let i = index; i<line.length; i++){
        if (line[i] === id){
            let counter = 0;
            while(line[i+counter] === id){
                counter++;
            }
            return counter;
        }
    }
    return -1;
}

/**
    *@param {Array} arr 
    *@param {Number} size
    */
function findFreeSpaceOfSize(arr, size){
     // Ensure size is not larger than the array length
  if (size > arr.length) {
    return -1;
  }

  for (let i = 0; i <= arr.length - size; i++) {
    // Check if all elements in the slice are '.'
    let allDots = true;
    for (let j = i; j < i + size; j++) {
      if (arr[j] !== '.') {
        allDots = false;
        break;
      }
    }
    
    if (allDots) {
      return i; // Return the starting index of the sequence
    }
  }

  return -1; // Return -1 if no sequence of that size is found
}


/**
    *@param {Array} line 
    */
function calculateCheckSum(line){
    let sum = 0;
    for (let i = 0; i<line.length; i++){
        if (line[i] === '.'){
            continue;
        }
        let num = parseInt(line[i]);
        sum += i * num;
    }
    return sum;
}

/**
    *@param {Array} line 
    */
function transformFile(line){
    let freeSpace = findFreeSpace(line);
    let fileSpace = findFile(line);
    while (fileSpace - freeSpace >= 1){
        line[freeSpace] = line[fileSpace]
        line[fileSpace] = '.'
        freeSpace = findFreeSpace(line)
        fileSpace = findFile(line)
    }
    return line;
}

/**
    *@param {Array} line 
    */
function findFreeSpace(line){
    let found = false;
    let i = 0;
    while(i<line.length && !found){
        if (line[i] === '.'){
            found = true;
            return i;
        }else{
            i++;
        }
    }
    return -1;
}

/**
    *@param {Array} line 
    */
function findFile(line){
    let found = false;
    let i = line.length-1;
    while(i>=0 && !found){
        if (line[i] !== '.'){
            found = true;
            return i;
        }else{
            i--;
        }
    }
    return -1;
}

/**
    *@param {String} line
    */
    function convertLine(line){
        let newString =[];
        let idCounter = 0;
        for (let i = 0; i<line.length; i++){
            let count = parseInt(line[i]);
            if (i == 0 || i%2 == 0){
                for (let j = 0; j<count; j++){
                    newString.push(idCounter)
                }
                idCounter++
            } else{
               for (let j=0; j<count; j++){
                   newString.push('.')
               } 
            }
        }
        return newString;
    }
