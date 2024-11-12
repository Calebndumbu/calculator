// === Variables ===
let num1;
let operator;
let num2;
let currentValue = "";

// === Display Handling ===
const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const currentDisplay = document.getElementById("current");

// Function to update the main display (current value)
function updateDisplay(value) {
  currentDisplay.textContent = value;
}

// Function to update the history display (numbers and operators in grey)
function updateHistory(value) {
  historyDisplay.textContent = value;
}

// === Arithmetic Functions ===
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return "Error: Division by zero";
  return a / b;
}

// Main function to perform operation based on the operator
function operate(operator, num1, num2) {
  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
    default:
      return "Error: Invalid operator";
  }
}

// === Calculator Logic ===

// Function to handle digit button clicks
function handleDigitClick(digit) {
  if (currentValue === "0") {
    currentValue = ""; // Prevent "0" from showing initially
  }
  currentValue += digit;
  updateDisplay(currentValue);

  // Only append to history if it is not the first entry
  if (historyDisplay.textContent === "0" || historyDisplay.textContent === "") {
    historyDisplay.textContent = digit; // Replace initial "0" with the first digit
  } else {
    historyDisplay.textContent += digit; // Append to history
  }
}

// Function to handle operator button clicks
function handleOperatorClick(op) {
  if (currentValue === "") return; // Prevent operator without number
  if (num1 === undefined) {
    num1 = parseFloat(currentValue);
  } else if (num2 === undefined) {
    num2 = parseFloat(currentValue);
  }
  operator = op;

  // Update history with operator (only if there is a previous number)
  if (num1 !== undefined) {
    updateHistory(`${historyDisplay.textContent} ${op} `); // Add operator to history
    currentValue = ""; // Clear current value for next input
  }
}

// Function to handle equals button click
// Function to handle equals button click
function handleEqualsClick() {
  if (num1 !== undefined && operator && currentValue !== "") {
    num2 = parseFloat(currentValue);
    const result = operate(operator, num1, num2);
    updateDisplay(result);

    // Reset history after calculation
    historyDisplay.textContent = ""; // Clear the history after displaying result

    // Prepare for the next calculation
    num1 = result;
    num2 = undefined;
    operator = undefined;
    currentValue = "";
  }
}

// Function to handle clear button click
function handleClearClick() {
  currentValue = "";
  num1 = undefined;
  num2 = undefined;
  operator = undefined;
  updateDisplay("0");
  updateHistory(""); // Clear history display
}

// === Event Listeners ===
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.textContent;

    if (buttonText >= "0" && buttonText <= "9") {
      handleDigitClick(buttonText);
    } else if (["+", "-", "*", "/"].includes(buttonText)) {
      handleOperatorClick(buttonText);
    } else if (buttonText === "=") {
      handleEqualsClick();
    } else if (buttonText === "C") {
      handleClearClick();
    }
  });
});
