const { readFile } = require('fs');

/**
 * Evaluates an expression strictly left-to-right without operator precedence.
 * 
 * @param {number[]} numbers - The array of numbers.
 * @param {string[]} operators - The array of operators ('+', '*', '||').
 * @returns {number} - The result of the evaluated expression.
 */
function evaluateExpression(numbers, operators) {
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const nextNumber = numbers[i + 1];
        if (operator === '+') {
            result += nextNumber;
        } else if (operator === '*') {
            result *= nextNumber;
        } else if (operator === '||') {
            // Concatenate current result with next number
            result = parseInt(result.toString() + nextNumber.toString(), 10);
        }
    }
    return result;
}

/**
 * Generates all possible operator combinations for a given number of operator positions,
 * allowing at most one '||' operator.
 * 
 * @param {number} numOperators - The number of operator positions.
 * @returns {string[][]} - An array of operator combinations, each being an array of operators.
 */
function generateOperatorCombinations(numOperators) {
    const operators = ['+', '*', '||'];
    const combinations = [];

    // Helper function to recursively build combinations
    function buildCombinations(currentCombo, position, hasConcatenation) {
        if (position === numOperators) {
            combinations.push([...currentCombo]);
            return;
        }

        // Iterate through possible operators
        for (let op of operators) {
            if (op === '||') {
                if (hasConcatenation) continue; // Skip if '||' already used
                currentCombo.push(op);
                buildCombinations(currentCombo, position + 1, true);
                currentCombo.pop();
            } else {
                currentCombo.push(op);
                buildCombinations(currentCombo, position + 1, hasConcatenation);
                currentCombo.pop();
            }
        }
    }

    buildCombinations([], 0, false);
    return combinations;
}

/**
 * Processes the input file and calculates the total calibration result.
 * 
 * @param {string} filePath - The path to the input file.
 */
function computeTotalCalibrationResult(filePath) {
    readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        // Clean and split the input into lines, removing any carriage returns and empty lines
        const lines = data.replace(/\r/g, "").split("\n").filter(line => line.trim() !== "");

        let totalCounter = 0; // To accumulate the sum of matching targets

        for (const line of lines) {
            // Split each line into target and numbers based on ": "
            const [targetStr, numbersStr] = line.split(': ').map(part => part.trim());

            if (!targetStr || !numbersStr) {
                console.warn(`Invalid line format (skipped): "${line}"`);
                continue;
            }

            const target = Number(targetStr);
            const numbers = numbersStr.split(' ').map(Number);

            // Validate number conversion
            if (isNaN(target) || numbers.some(num => isNaN(num))) {
                console.warn(`Invalid number in line (skipped): "${line}"`);
                continue;
            }

            const numOperators = numbers.length - 1;
            if (numOperators < 0) {
                console.warn(`No numbers to process for line (skipped): "${line}"`);
                continue;
            }

            const operatorCombinations = generateOperatorCombinations(numOperators);

            let matchFound = false; // Flag to indicate if any combination matches the target

            for (const operators of operatorCombinations) {
                const result = evaluateExpression(numbers, operators);
                if (result === target) {
                    totalCounter += target;
                    matchFound = true;

                    // Log the matching combination
                    const expressionParts = [];
                    for (let i = 0; i < operators.length; i++) {
                        expressionParts.push(numbers[i].toString());
                        expressionParts.push(operators[i]);
                    }
                    expressionParts.push(numbers[numbers.length - 1].toString());
                    const expression = expressionParts.join(' ');
                    console.log(`Match Found: ${target}: ${expression} = ${target}`);

                    // Since '||' can be used only once, but multiple matches are allowed,
                    // we continue checking all combinations.
                }
            }

            if (!matchFound) {
                console.log(`No Match: ${target}: ${numbers.join(' ')}`);
            }
        }

        console.log(`Total Calibration Result: ${totalCounter}`);
    });
}

// Execute the main function with the input file path
computeTotalCalibrationResult('./input-day7.txt');
