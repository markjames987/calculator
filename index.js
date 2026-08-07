
// Get the calculator screen
const screen = document.getElementById("screen");


// Add numbers and operators to the screen
function appendtodisplay(value) {
    screen.value += value;
}




// Calculate
function calculate() {

    let expression = screen.value;


    // =========================
    // MODULUS %
    // =========================

    if (expression.includes("MOD")) {

        let numbers = expression.split("MOD");

        let a = Number(numbers[0]);
        let b = Number(numbers[1]);

        if (b === 0) {
            screen.value = "Error";
            return;
        }

        screen.value = a % b;
    }


    // =========================
    // EXPONENT ^
    // =========================

    else if (expression.includes("^")) {

        let numbers = expression.split("^");

        let a = Number(numbers[0]);
        let b = Number(numbers[1]);

        let result = 1;

        // Calculate a^b without Math.pow()
        for (let i = 0; i < b; i++) {
            result = result * a;
        }

        screen.value = result;
    }


    // =========================
    // ADDITION
    // =========================

    else if (expression.includes("+")) {

        let numbers = expression.split("+");

        let a = Number(numbers[0]);
        let b = Number(numbers[1]);

        screen.value = a + b;
    }


    // =========================
    // SUBTRACTION
    // =========================

    else if (expression.includes("-")) {

        let numbers = expression.split("-");

        let a = Number(numbers[0]);
        let b = Number(numbers[1]);

        screen.value = a - b;
    }


    // =========================
    // MULTIPLICATION
    // =========================

    else if (expression.includes("*")) {

        let numbers = expression.split("*");

        let a = Number(numbers[0]);
        let b = Number(numbers[1]);

        screen.value = a * b;
    }


    // =========================
    // DIVISION
    // =========================

    else if (expression.includes("/")) {

        let numbers = expression.split("/");

        let a = Number(numbers[0]);
        let b = Number(numbers[1]);

        if (b === 0) {
            screen.value = "Error";
            return;
        }

        screen.value = a / b;
    }
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

