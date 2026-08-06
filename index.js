
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

