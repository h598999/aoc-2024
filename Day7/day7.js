const { readFile } = require('fs');

/**
    * Evaluates an expression strictly left-to-right without operator precedence.
    * 
    * @param {number[]} numbers - The array of numbers.
    * @param {string[]} operators - The array of operators ('+' or '*').
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
            }
        }
        return result;
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
                const maxCombinations = 1 << numOperators; // 2^(n-1) combinations

                let matchFound = false; // Flag to indicate if any combination matches the target

                for (let i = 0; i < maxCombinations; i++) {
                    const operators = [];
                    for (let j = 0; j < numOperators; j++) {
                        // If the j-th bit is set, use '*', else use '+'
                        operators.push((i & (1 << j)) ? '*' : '+');
                    }

                    const result = evaluateExpression(numbers, operators);

                    if (result === target) {
                        totalCounter += target;
                        matchFound = true;

                        // Optional: Log the matching combination
                        break; // No need to check further combinations for this line
                    }
                }
            }
            console.log(`Total Calibration Result: ${totalCounter}`);
        });
    }

// Execute the main function with the input file path
computeTotalCalibrationResult('./input-day7.txt');

