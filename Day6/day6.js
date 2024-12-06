import { readFile } from 'fs';

const Direction = Object.freeze({
    NORTH: "^",
    SOUTH: "v",
    EAST: ">",
    WEST: "<"
});

readFile('./input-day6.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const lines = data.trim().split('\n');
    const map = [];
    for (let i = 0; i < lines.length; i++) {
        map[i] = [];
        for (let j = 0; j < lines[i].length; j++) {
            map[i][j] = lines[i][j];
        }
    }

    let position = findGuard(map);

    // First run: Mark all visited '.' cells as 'X' along the guard's initial path
    const visitedSet = new Set();
    move(map, position, visitedSet);
    printMap(map)
    let counter = 0;
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            console.log(map[i][j])
            if (map[i][j] !== "X") {
                console.log('Skipped')
                continue;
            }
            console.log("Not skipped")
            // Temporarily place a blocker
            let prevval = map[i][j];
            map[i][j] = "#";

            let increment = move2(map, position, position, 0, 0, new Map());
            if (increment > 0) {
                counter += increment;
                console.log(counter);
            } else {
                console.log("No loop");
            }

            // Revert the cell after testing
            map[i][j] = prevval;
        }
    }

    console.log(counter);
});

/**
 * Check if map[i][j] is 'X' or adjacent to an 'X'.
 */
function isNextToX(map, i, j) {
    if (map[i][j] === 'X') return true;
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    for (const [di, dj] of directions) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && ni < map.length && nj >= 0 && nj < map[0].length) {
            if (map[ni][nj] === 'X') return true;
        }
    }
    return false;
}

/** Move function that marks visited '.' cells as 'X'. */
function move(map, position, set) {
    let i = position.row;
    let j = position.col;

    if (position.direction === "NORTH") {
        while (true) {
            if ((i < 0 || i >= map.length || j < 0 || j >= map[i].length)) {
                return set.size;
            }
            if (map[i][j] === "#") {
                return move(map, { row: i + 1, col: j, direction: flip(position.direction) }, set);
            }
            if (map[i][j] === "." || map[i][j] === "^") {
                map[i][j] = "X";
                set.add([i, j]);
            }
            i--;
        }
    } else if (position.direction === "SOUTH") {
        while (true) {
            if (i < 0 || i >= map.length || j < 0 || j >= map[i].length) {
                return set.size;
            }
            if (map[i][j] === "#") {
                return move(map, { row: i - 1, col: j, direction: flip(position.direction) }, set);
            }
            if (map[i][j] === ".") {
                map[i][j] = "X";
                set.add([i, j]);
            }
            i++;
        }
    } else if (position.direction === "WEST") {
        while (true) {
            if (i < 0 || i >= map.length || j < 0 || j >= map[i].length) {
                return set.size;
            }
            if (map[i][j] === "#") {
                return move(map, { row: i, col: j + 1, direction: flip(position.direction) }, set);
            }
            if (map[i][j] === ".") {
                map[i][j] = "X";
                set.add([i, j]);
            }
            j--;
        }
    } else { // EAST
        while (true) {
            if (i < 0 || i >= map.length || j < 0 || j >= map[i].length) {
                return set.size;
            }
            if (map[i][j] === "#") {
                return move(map, { row: i, col: j - 1, direction: flip(position.direction) }, set);
            }
            if (map[i][j] === ".") {
                map[i][j] = "X";
                set.add([i, j]);
            }
            j++;
        }
    }
}

function move2(map, startPosition, position, counter, run, visitedArr) {
    const rows = map.length;
    const cols = map[0].length;

    const directionDelta = {
        NORTH: { di: -1, dj: 0 },
        SOUTH: { di: 1, dj: 0 },
        WEST:  { di: 0, dj: -1 },
        EAST:  { di: 0, dj: 1 }
    };

    while (true) {
        let i = position.row;
        let j = position.col;
        let dir = position.direction;
        const delta = directionDelta[dir];

        while (true) {
            if (i < 0 || i >= rows || j < 0 || j >= cols) {
                return 0; // Out of bounds
            }

            const currentIdx = i * cols + j;

            if (visitedArr[currentIdx] === dir) {
                return 1; // Cycle detected
            }

            const cell = map[i][j];

            if (cell === "#") {
                position = flipPosition(i, j, dir);
                break;
            }

            if (cell === ".") {
                map[i][j] = "X";
            }

            visitedArr[currentIdx] = dir;

            i += delta.di;
            j += delta.dj;
        }
    }
}

function flipPosition(i, j, dir) {
    const flippedDir = flipDir(dir);
    let newI = i;
    let newJ = j;

    if (dir === "NORTH") {
        newI = i + 1;
    } else if (dir === "SOUTH") {
        newI = i - 1;
    } else if (dir === "WEST") {
        newJ = j + 1;
    } else { // EAST
        newJ = j - 1;
    }

    return { row: newI, col: newJ, direction: flippedDir };
}

function flipDir(direction) {
    if (direction === "NORTH") return "EAST";
    if (direction === "SOUTH") return "WEST";
    if (direction === "WEST") return "NORTH";
    if (direction === "EAST") return "SOUTH";
    return direction;
}

function findGuard(map) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            for (const dirKey in Direction) {
                if (map[i][j] === Direction[dirKey]) {
                    return { row: i, col: j, direction: dirKey };
                }
            }
        }
    }
    return -1;
}

function flip(direction) {
    if (direction === "NORTH") {
        return "EAST";
    }
    if (direction === "SOUTH") {
        return "WEST";
    }
    if (direction === "WEST") {
        return "NORTH";
    }
    if (direction === "EAST") {
        return "SOUTH";
    }
}

function printMap(map) {
    for (let i = 0; i < map.length; i++) {
        let string = '';
        for (let j = 0; j < map[i].length; j++) {
            string += map[i][j];
        }
        console.log(string);
    }
}
