// === Variables ===
let num1;
let operator;
let num2;
let currentValue = "";

// === Display Handling ===
const display = document.getElementById("current");
const historyDisplay = document.getElementById("history");

// Function to update the main display (current value)
function updateDisplay(value) {
  display.textContent = value;
}

// Function to update the history display (numbers and operators in grey)
function updateHistory(value) {
  const maxLength = 6; // Set maximum length for the history display
  if (value.length > maxLength) {
    value = "..." + value.slice(value.length - maxLength); // Truncate older entries
  }
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
// Function to handle operator button clicks
function handleOperatorClick(op) {
  // Case 1: If there's no number input yet, ignore operator click
  if (currentValue === "" && num1 === undefined) return;

  // Case 2: If we already have an operator and both num1 and num2, perform the operation
  if (num1 !== undefined && operator && currentValue !== "") {
    num2 = parseFloat(currentValue);
    const result = operate(operator, num1, num2);
    updateDisplay(result);

    // Set the result as num1 for chaining operations
    num1 = result;
    currentValue = ""; // Clear currentValue for next input
  } else if (num1 === undefined) {
    // If num1 is not set, parse the currentValue as num1
    num1 = parseFloat(currentValue);
    currentValue = ""; // Clear currentValue for next input
  }

  // Set the new operator for the next calculation
  operator = op;
  updateHistory(`${historyDisplay.textContent} ${op} `);
}

// Function to handle equals button click
function handleEqualsClick() {
  if (num1 !== undefined && operator && currentValue !== "") {
    num2 = parseFloat(currentValue);
    const result = operate(operator, num1, num2);
    updateDisplay(result);

    // Store the result for the next calculation and reset only num2 and currentValue
    num1 = result;
    operator = undefined; // Reset operator for the next input
    currentValue = ""; // Clear current value for the next input
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

// Function to handle delete button click
function handleDeleteClick() {
  // Remove the last character from the current value
  currentValue = currentValue.slice(0, -1);

  // If the current value becomes empty, set it to "0"
  if (currentValue === "") {
    currentValue = "0";
  }

  updateDisplay(currentValue);

  // Update the history display
  if (historyDisplay.textContent !== "0" && historyDisplay.textContent !== "") {
    historyDisplay.textContent = historyDisplay.textContent.slice(0, -1);
  }
}

// Event listeners for all buttons
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
    } else if (buttonText === "X") {
      handleDeleteClick();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    handleDigitClick(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleOperatorClick(key);
  } else if (key === "Escape") {
    handleClearClick();
  } else if (key === "Backspace") {
    handleDeleteClick();
  }

  if (key === "Enter") {
    handleEqualsClick();
  }
});
