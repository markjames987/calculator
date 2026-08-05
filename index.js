// =========================
// Calculator Program
// =========================

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

        // Remove floating point errors
        screen.value = parseFloat(result.toFixed(10));
    }
    catch {
        screen.value = "Error";
    }
}

// =========================
// Evaluate Expression
// =========================

function evaluateExpression(expression) {

    expression = expression.replace(/\s+/g, "");

    if (expression.includes("MOD")) {

        let numbers = expression.split("MOD");
    // Solve brackets first
    while (expression.includes("(")) {

        let open = expression.lastIndexOf("(");
        let close = expression.indexOf(")", open);

        if (close === -1)
            throw "Bracket Error";

        let inside = expression.substring(open + 1, close);

        let answer = evaluateSimple(inside);

        expression =
            expression.substring(0, open) +
            answer +
            expression.substring(close + 1);
    }

    return evaluateSimple(expression);
}

// =========================
// Evaluate Without Brackets
// =========================

function evaluateSimple(expression) {

    // Split expression into numbers/operators
    let tokens = expression.match(/(\d*\.?\d+|[+\-*/%^])/g);

    if (!tokens)
        throw "Invalid";

    // -------------------------
    // Handle negative numbers
    // -------------------------

    for (let i = 0; i < tokens.length; i++) {

        if (
            tokens[i] === "-" &&
            (i === 0 || ["+","-","*","/","%","^"].includes(tokens[i-1]))
        ) {

            let negative = (-parseFloat(tokens[i+1])).toString();

            tokens.splice(i,2,negative);
        }
    }

    // =========================
    // EXPONENT (^)
    // =========================

    let i = 0;

    while(i < tokens.length){

        if(tokens[i] === "^"){

            let base = parseFloat(tokens[i-1]);
            let exponent = parseInt(tokens[i+1]);

            let result = 1;

            if(exponent >= 0){

                for(let j=0; j<exponent; j++){
                    result *= base;
                }

            }else{

                for(let j=0; j<Math.abs(exponent); j++){
                    result *= base;
                }

                result = 1/result;
            }

            tokens.splice(i-1,3,result.toString());

            i = 0;
        }

        else{
            i++;
        }
    }

    // =========================
    // MULTIPLY DIVIDE MODULUS
    // =========================

    i = 0;

    while(i < tokens.length){

        if(
            tokens[i] == "*" ||
            tokens[i] == "/" ||
            tokens[i] == "%"
        ){

            let left = parseFloat(tokens[i-1]);
            let right = parseFloat(tokens[i+1]);

            let result;

            if(tokens[i] == "*")
                result = left * right;

            else if(tokens[i] == "/"){

                if(right == 0)
                    throw "Divide by zero";

                result = left / right;
            }

            else{

                if(right == 0)
                    throw "Divide by zero";

                result = left % right;
            }

            tokens.splice(i-1,3,result.toString());

            i = 0;
        }

        else{
            i++;
        }
    }

    // =========================
    // ADDITION & SUBTRACTION
    // =========================

    let answer = parseFloat(tokens[0]);

    i = 1;

    while(i < tokens.length){

        let operator = tokens[i];

        let number = parseFloat(tokens[i+1]);

        if(operator == "+")
            answer += number;

        else if(operator == "-")
            answer -= number;

        i += 2;
    }

    return answer;
}
