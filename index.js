// Calculator Program

const screen = document.getElementById("screen");

function appendtodisplay(value) {
    screen.value += value;
}

function clearDisplay() {
    screen.value = "";
}

function calculate() {
    try {
        let result = evaluateExpression(screen.value);

        // Round to 10 decimal places and remove unnecessary zeros
        screen.value = parseFloat(result.toFixed(10));

    } catch (error) {
        screen.value = "Error";
    }


}



// ===============================
// BODMAS Expression Evaluator
// ===============================

function evaluateExpression(expression) {

    // Remove spaces
    expression = expression.replace(/\s+/g, "");

    // Handle brackets first
    while (expression.includes("(")) {

        let open = expression.lastIndexOf("(");
        let close = expression.indexOf(")", open);

        if (close === -1) {
            throw "Missing bracket";
        }

        let inside = expression.substring(open + 1, close);
        let result = evaluateSimple(inside);

        expression =
            expression.substring(0, open) +
            result +
            expression.substring(close + 1);
    }

    return evaluateSimple(expression);
}

// ===============================
// Evaluates expressions without brackets
// ===============================

function evaluateSimple(expression) {

    // Tokenize numbers and operators
    let tokens = expression.match(/(\d*\.?\d+|[+\-*/%^])/g);

    if (!tokens) {
        throw "Invalid expression";
    }

    // -----------------------
    // Handle Negative Numbers
    // -----------------------

    for (let i = 0; i < tokens.length; i++) {

        if (
            tokens[i] === "-" &&
            (i === 0 || ["+", "-", "*", "/", "%", "^"].includes(tokens[i - 1]))
        ) {

            let negativeNumber = (-parseFloat(tokens[i + 1])).toString();

            tokens.splice(i, 2, negativeNumber);
        }
    }

    // -----------------------
    // Exponent (^)
    // -----------------------

    let i = 0;

    while (i < tokens.length) {

        if (tokens[i] === "^") {

            let left = parseFloat(tokens[i - 1]);
            let right = parseFloat(tokens[i + 1]);

            let result = 1;

            if (right === 0) {

                result = 1;

            } else if (right > 0) {

                for (let j = 0; j < right; j++) {
                    result *= left;
                }

            } else {

                for (let j = 0; j < -right; j++) {
                    result *= left;
                }

                result = 1 / result;
            }

            tokens.splice(i - 1, 3, result.toString());

            i = 0;

        } else {

            i++;
        }
    }

    // -----------------------
    // Multiplication, Division, Modulus
    // -----------------------

    i = 0;

    while (i < tokens.length) {

        if (
            tokens[i] === "*" ||
            tokens[i] === "/" ||
            tokens[i] === "%"
        ) {

            let left = parseFloat(tokens[i - 1]);
            let right = parseFloat(tokens[i + 1]);

            let result;

            if (tokens[i] === "*") {

                result = left * right;

            } else if (tokens[i] === "/") {

                if (right === 0) {
                    throw "Division by zero";
                }

                result = left / right;

            } else {

                if (right === 0) {
                    throw "Division by zero";
                }

                // Manual modulus
                let quotient = parseInt(left / right);

                result = left - (quotient * right);
            }

            tokens.splice(i - 1, 3, result.toString());

            i = 0;

        } else {

            i++;
        }
    }

    // -----------------------
    // Addition and Subtraction
    // -----------------------

    let answer = parseFloat(tokens[0]);

    i = 1;

    while (i < tokens.length) {

        let operator = tokens[i];
        let number = parseFloat(tokens[i + 1]);

        if (operator === "+") {

            answer += number;

        } else if (operator === "-") {

            answer -= number;
        }

        i += 2;
    }

    return answer;
}

function squareRoot() {
    try {
        let value = evaluateExpression(screen.value);

        if (value < 0) {
            throw "Negative Number";
        }

        screen.value = Math.sqrt(value);
    } catch (error) {
        screen.value = "Error";
    }
}

function decimalToFraction() {

    try {

        let decimal = parseFloat(screen.value);

        if (isNaN(decimal)) {
            throw "Invalid";
        }

        // Whole number
        if (Number.isInteger(decimal)) {
            screen.value = decimal + "/1";
            return;
        }

        let sign = decimal < 0 ? -1 : 1;
        decimal = Math.abs(decimal);

        let denominator = 1;

        while (decimal % 1 !== 0) {
            decimal *= 10;
            denominator *= 10;
        }

        let numerator = decimal;

        // Greatest Common Divisor
        function gcd(a, b) {
            while (b !== 0) {
                let temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

        let divisor = gcd(numerator, denominator);

        numerator /= divisor;
        denominator /= divisor;

        screen.value = (sign * numerator) + "/" + denominator;

    } catch (error) {
        screen.value = "Error";
    }

}
