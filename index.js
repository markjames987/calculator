
// =========================
// Calculator Program
// =========================

// The input element that shows everything on the screen.
const screen = document.getElementById("screen");

// True right after a result is shown, so the next
// number key starts a brand-new calculation.
let justCalculated = false;

// In-memory copy of all saved calculations.
let calcHistory = [];

// =========================
// Append Value To Display
// =========================
function appendtodisplay(value) {

    // If a calculation just finished:
    //   - a digit (or double-zero) starts a fresh calculation,
    //   - an operator continues from the shown result.
    if (justCalculated) {
        if (/\d/.test(value)) {
            clearDisplay();
        }
        justCalculated = false;
    }

    // Never allow two operators in a row (e.g. "5++3").
    const lastChar = screen.value.slice(-1);
    if ("+-*/%^".includes(value) && "+-*/%^".includes(lastChar)) {
        return;
    }

    // Only one decimal point inside a single number (e.g. "5.3.2" is blocked).
    if (value === ".") {
        const currentNumber = screen.value.split(/[+\-*/%^]/).pop();
        if (currentNumber.includes(".")) {
            return;
        }
    }

    // Keep the display from getting unreasonably long.
    if (screen.value.length >= 24) {
        return;
    }

    screen.value += value;
}

// =========================
// Clear The Display
// =========================
function clearDisplay() {
    screen.value = "";
    justCalculated = false;
}

// =========================
// Delete The Last Character
// =========================
function deleteLast() {
    screen.value = screen.value.slice(0, -1);
    justCalculated = false;
}

// =========================
// Toggle Positive / Negative
// =========================
function toggleSign() {
    if (!screen.value) {
        return;
    }
    justCalculated = false;
    if (screen.value.startsWith("-")) {
        screen.value = screen.value.slice(1);
    } else {
        screen.value = "-" + screen.value;
    }
}

// =========================
// Calculate The Result
// =========================
function calculate() {
    try {
        let result = evaluateExpression(screen.value);

        // Remove tiny floating point errors (0.1 + 0.2 becomes 0.3).
        result = parseFloat(result.toFixed(10));

        if (isFinite(result)) {
            // Save to history before the result replaces the expression.
            __saveHistory(screen.value, result);
            screen.value = result;
            justCalculated = true;
        } else {
            screen.value = "Error";
            justCalculated = true;
        }
    }
    catch {
        screen.value = "Error";
        justCalculated = true;
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
// History & Preview Panels
// =========================

// Show / hide the history panel.
function toggleHistory() {
    const panel = document.getElementById("historyPanel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    loadHistory();
}

// Show / hide the preview panel.
function togglePreview() {
    const panel = document.getElementById("previewPanel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    renderPreview();
}

// =========================
// Show A Message On Display
// =========================
function showMessage(message) {
    const previous = screen.value;
    screen.value = message;
    clearTimeout(showMessage.timer);
    showMessage.timer = setTimeout(function () {
        screen.value = previous;
    }, 1000);
}

// =========================
// Save / Recall / Redo
// =========================

// Save the expression currently on the display into history.
function saveCalc() {
    if (!screen.value) {
        return;
    }
    try {
        let expr = screen.value;
        let result = parseFloat(evaluateExpression(expr).toFixed(10));
        __saveHistory(expr, result);
    }
    catch {
        // Invalid expression: do nothing.
        return;
    }
    showMessage("History Saved");
}

// Recall the result of the last saved calculation.
function recallResult() {
    if (calcHistory.length === 0) {
        showMessage("No History");
        return;
    }
    const last = calcHistory[calcHistory.length - 1];
    screen.value = last.result;
    justCalculated = true;
}

// Re-run the last saved calculation.
function redoLast() {
    if (calcHistory.length === 0) {
        showMessage("No History");
        return;
    }
    const last = calcHistory[calcHistory.length - 1];
    screen.value = last.expr;
    calculate();
}

// =========================
// History Storage
// =========================

// Remove every saved calculation.
function clearHistory() {
    calcHistory = [];
    localStorage.removeItem("calcHistory");
    renderHistory();
    renderPreview();
    showMessage("History Cleared");
}

// Load saved history from localStorage.
function loadHistory() {
    try {
        calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
    }
    catch {
        calcHistory = [];
    }
    renderHistory();
    renderPreview();
}

// Save one calculation and refresh the panels.
function __saveHistory(expr, result) {
    const last = calcHistory[calcHistory.length - 1];

    // Don't store the exact same calculation twice in a row.
    if (last && last.expr === expr && String(last.result) === String(result)) {
        renderHistory();
        renderPreview();
        return;
    }

    calcHistory.push({ expr: expr, result: result });
    localStorage.setItem("calcHistory", JSON.stringify(calcHistory));
    renderHistory();
    renderPreview();
}

// Rebuild the history list on screen.
function renderHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    for (let i = 0; i < calcHistory.length; i++) {
        const entry = calcHistory[i];

        const item = document.createElement("div");
        item.className = "history-item";
        item.setAttribute("data-value", entry.expr);
        item.setAttribute("data-result", entry.result);
        item.textContent = entry.expr + " = " + entry.result;

        // Clicking an entry brings its result back to the display.
        item.onclick = function () {
            screen.value = entry.result;
            justCalculated = true;
        };

        list.appendChild(item);
    }
}

// Rebuild the preview panel with every saved calculation.
function renderPreview() {
    const list = document.getElementById("previewList");
    if (!list) {
        return;
    }
    list.innerHTML = "";

    if (calcHistory.length === 0) {
        const empty = document.createElement("p");
        empty.className = "preview-empty";
        empty.textContent = "No calculations yet.";
        list.appendChild(empty);
        return;
    }

    for (let i = 0; i < calcHistory.length; i++) {
        const entry = calcHistory[i];

        const item = document.createElement("div");
        item.className = "history-item";
        item.textContent = entry.expr + " = " + entry.result;

        // Clicking an entry brings its result back to the display.
        item.onclick = function () {
            screen.value = entry.result;
            justCalculated = true;
        };

        list.appendChild(item);
    }
}

// =========================
// Keyboard Support
// =========================
document.addEventListener("keydown", function (e) {
    const key = e.key;

    if (key >= "0" && key <= "9") {
        appendtodisplay(key);
        e.preventDefault();
    }
    else if (["+", "-", "*", "/", "%", "^", ".", "(", ")"].includes(key)) {
        appendtodisplay(key);
        e.preventDefault();
    }
    else if (key === "Enter" || key === "=") {
        calculate();
        e.preventDefault();
    }
    else if (key === "Backspace") {
        deleteLast();
        e.preventDefault();
    }
    else if (key === "Escape" || key === "c" || key === "C") {
        clearDisplay();
        e.preventDefault();
    }
});

// =========================
// Start Up
// =========================
window.addEventListener("DOMContentLoaded", function () {
    loadHistory();

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