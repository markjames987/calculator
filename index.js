const screen = document.getElementById("screen");

function appendtodisplay(value) {
    screen.value += value;
}

function calculate() {
    try {
        let expression = screen.value;

        // Convert nrootm into root(n,m)
        expression = expression.replace(
            /(\d+(\.\d+)?)root(\d+(\.\d+)?)/gi,
            "root($1,$3)"
        );

        let result = Function(
            "root",
            '"use strict"; return (' + expression + ');'
        )(root);

        if (!isFinite(result)) {
            screen.value = "Error";
            return;
        }

        if (result % 1 !== 0) {
            result = Number(result.toFixed(3));
        }

        screen.value = result;

    } catch {
        screen.value = "Error";
    }
}

function squareRoot() {
    try {
        let value = parseFloat(screen.value);

        if (isNaN(value) || value < 0) {
            screen.value = "Error";
            return;
        }

        let result = Math.sqrt(value);

        if (!Number.isInteger(result)) {
            result = Number(result.toFixed(3));
        }

        screen.value = result;
    } catch {
        screen.value = "Error";
    }
}

// Convert decimal to fraction
function decimalToFraction() {
    let value = parseFloat(screen.value);

    if (isNaN(value)) {
        screen.value = "Error";
        return;
    }

    // If already an integer
    if (Number.isInteger(value)) {
        screen.value = value + "/1";
        return;
    }

    let sign = value < 0 ? -1 : 1;
    value = Math.abs(value);

    // Convert up to 3 decimal places
    let denominator = 1000;
    let numerator = Math.round(value * denominator);

    // Find Greatest Common Divisor
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

    if (sign < 0) {
        numerator *= -1;
    }

    screen.value = `${numerator}/${denominator}`;
}
function root(index, number) {
    if (index === 0) return NaN;

    let guess = number / index;

    for (let i = 0; i < 20; i++) {
        guess = ((index - 1) * guess + number / (guess ** (index - 1))) / index;
    }

    return guess;
}
