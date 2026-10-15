const display = document.getElementById("display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");
const deleteButton = document.querySelector(".delete");

let expression = "";


// Number and decimal buttons
numberButtons.forEach(button => {
    button.addEventListener("click", () => {

        expression += button.textContent;

        display.value = expression;
    });
});


// Operator buttons
operatorButtons.forEach(button => {
    button.addEventListener("click", () => {

        if (expression === "") {
            return;
        }

        // Prevent two operators next to each other
        const lastCharacter = expression.slice(-1);

        if ("+-×÷".includes(lastCharacter)) {
            expression = expression.slice(0, -1);
        }

        expression += button.textContent;

        display.value = expression;
    });
});


// Equals button
equalsButton.addEventListener("click", () => {

    if (expression === "") {
        return;
    }

    try {

        const result = calculateExpression(expression);

        display.value = result;

        expression = result.toString();

    } catch (error) {

        display.value = "Error";
        expression = "";
    }
});


// Calculator logic
function calculateExpression(input) {

    // Convert calculator symbols to normal operators
    input = input.replaceAll("×", "*");
    input = input.replaceAll("÷", "/");
    input = input.replaceAll("−", "-");

    // Split numbers and operators
    const numbers = input.split(/[+\-*/]/);
    const operators = input.match(/[+\-*/]/g);

    if (!operators || numbers.length === 1) {
        return parseFloat(numbers[0]);
    }

    // Convert strings to numbers
    let values = numbers.map(Number);

    // First perform × and ÷
    for (let i = 0; i < operators.length; i++) {

        if (operators[i] === "*" || operators[i] === "/") {

            if (operators[i] === "/" && values[i + 1] === 0) {
                throw new Error("Division by zero");
            }

            let result;

            if (operators[i] === "*") {
                result = values[i] * values[i + 1];
            } else {
                result = values[i] / values[i + 1];
            }

            values.splice(i, 2, result);
            operators.splice(i, 1);

            i--;
        }
    }

    // Then perform + and -
    let result = values[0];

    for (let i = 0; i < operators.length; i++) {

        if (operators[i] === "+") {
            result += values[i + 1];
        }

        else if (operators[i] === "-") {
            result -= values[i + 1];
        }
    }

    return result;
}


// Clear button
clearButton.addEventListener("click", () => {

    expression = "";

    display.value = "0";
});


// Delete button
deleteButton.addEventListener("click", () => {

    expression = expression.slice(0, -1);

    if (expression === "") {
        display.value = "0";
    } else {
        display.value = expression;
    }
});