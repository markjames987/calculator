const screen = document.getElementById("screen");

    // Display numbers/operators
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

    // =========================
    // Factorial helper by Laura
    // =========================
    function factorialNum(num) {
        if (num < 0) return NaN;
        if (num === 0 || num === 1) return 1;

        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        return result;
    }

    // nCr helper: n! / (r! * (n-r)!)
    // =========================
    // COMBINATION FUNTION by Laura
    // =========================
    function combinationNum(n, r) {
        if (n < 0 || r < 0 || r > n) return NaN;
        // Use the smaller of r, n-r to reduce iterations and overflow risk
        r = Math.min(r, n - r);
        let result = 1;
        for (let i = 0; i < r; i++) {
            result = (result * (n - i)) / (i + 1);
        }
        return Math.round(result);
    }


    // =========================
    // BASIC CALCULATOR by Laura
    // =========================
    function calculate() {
        try {
            const expr = screen.value;

            // Check for nCr pattern, e.g. "5C2"
            if (expr.includes("C")) {
                const parts = expr.split("C");
                if (parts.length !== 2) {
                    screen.value = "Error";
                    return;
                }
                const n = Number(parts[0]);
                const r = Number(parts[1]);
                if (isNaN(n) || isNaN(r)) {
                    screen.value = "Error";
                    return;
                }
                screen.value = combinationNum(n, r);
                return;
            }

            screen.value = eval(screen.value);
        } catch (error) {
            screen.value = "Error";
        }
    }

    // =========================
    // Show/hide the 2-unknowns panel BY LAURA
    // =========================
    function toggleSimPanel() {
        document.getElementById("sim-panel").classList.toggle("open");
    }

   // =========================
    // Solve a1*x + b1*y = c1
    //       a2*x + b2*y = c2
    // using Cramer's rule BY LAURA
    // =========================
    function solveSimultaneous() {
        const a1 = Number(document.getElementById("a1").value);
        const b1 = Number(document.getElementById("b1").value);
        const c1 = Number(document.getElementById("c1").value);
        const a2 = Number(document.getElementById("a2").value);
        const b2 = Number(document.getElementById("b2").value);
        const c2 = Number(document.getElementById("c2").value);

        if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
            screen.value = "Error";
            return;
        }

        // ============================================================
        // Main determinant in calculating the solutions to the equation 
        // BY LAURA
        // ============================================================
        const det = a1 * b2 - a2 * b1;

        if (det === 0) {
            // Check if the two equations are actually the same line (infinite solutions)
            // or parallel lines (no solution)
            if (a1 * c2 === a2 * c1 && b1 * c2 === b2 * c1) {
                screen.value = "Infinite solutions";
            } else {
                screen.value = "No solution";
            }
            return;
        }

        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;

        const round = (n) => Math.round(n * 1000) / 1000;
        screen.value = `x=${round(x)}, y=${round(y)}`;
    }
