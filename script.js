// Variables
let num1;
let operator;
let num2;
let currentValue = "";
let lastInputWasOperator = false;
let isDecimal = false;
let calculationComplete = false;
let awaitingNegativeOperand = false;
let lastButtonWasEquals = false;

// Display Handling
const display = document.getElementById("current");
const historyDisplay = document.getElementById("history");

function updateDisplay(value) {
  const displayText =
    typeof value === "number"
      ? parseFloat(value.toFixed(4)).toString().slice(0, 18)
      : value;

  display.textContent = displayText;
}

function updateHistory(value) {
  const maxLength = 20;
  historyDisplay.textContent =
    value.length > maxLength ? "..." + value.slice(-maxLength) : value;
}

// Arithmetic Functions
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
  return b === 0 ? "Cannot divide by zero" : a / b;
}

function operate(operator, num1, num2) {
  let result;
  switch (operator) {
    case "+":
      result = add(num1, num2);
      break;
    case "-":
      result = subtract(num1, num2);
      break;
    case "*":
      result = multiply(num1, num2);
      break;
    case "/":
      result = divide(num1, num2);
      break;
    default:
      return "Error";
  }
  return typeof result === "number" ? parseFloat(result.toFixed(4)) : result;
}

// Calculator Logic
function handleDigitClick(digit) {
  if (calculationComplete) {
    resetForNextCalculation();
  }

  if (currentValue.length >= 18) {
    return;
  }
  if (awaitingNegativeOperand && digit === "-") {
    currentValue = "-";
    updateDisplay(currentValue);
    updateHistory(historyDisplay.textContent + digit);
    awaitingNegativeOperand = false;
    lastInputWasOperator = false;
    return;
  }

  // Prevent leading zeros, except when starting a decimal number (like "0.")
  if (currentValue === "0" && digit !== ".") {
    currentValue = ""; // Clear the leading zero
  }

  if (digit === "." && isDecimal) return; // Prevent multiple decimals
  if (digit === ".") isDecimal = true;

  currentValue += digit;
  updateDisplay(currentValue);
  updateHistory(formatHistoryValue(historyDisplay.textContent + digit));
  lastInputWasOperator = false;
  lastButtonWasEquals = false;
}

function formatHistoryValue(value) {
  // Remove leading zeros unless followed by a decimal point
  return value.replace(/\b0+(?!\.|$)/g, "");
}

function handleEqualsClick() {
  if (lastButtonWasEquals) {
    handleClearClick();
    return;
  }
  if (num1 !== undefined && operator && currentValue !== "") {
    num2 = parseFloat(currentValue);
    let result = operate(operator, num1, num2);

    if (typeof result === "string") {
      updateDisplay(result);
      resetForNextCalculation();
      return;
    }
    updateDisplay(result);
    updateHistory(`${historyDisplay.textContent} = ${result}`);
    num1 = result;
    operator = undefined;
    currentValue = "";
    num2 = undefined;
    calculationComplete = true;
  } else if (currentValue !== "" || num1 !== undefined) {
    updateDisplay(currentValue || num1);
  } else {
    updateDisplay("Error");
    resetForNextCalculation();
  }
  lastInputWasOperator = false;
  lastButtonWasEquals = true;
}
let consecutiveMinusCount = 0; // Track consecutive "-" entries after an operator
let isStartingNegative = false; // Track if calculation starts with a negative number

function handleOperatorClick(op) {
  if (currentValue.slice(-1) === ".") {
    return; // Ignore the operator if it follows a decimal
  }
  // Allow "-" as the first input to denote a negative starting number
  if (op === "-" && !num1 && !currentValue) {
    if (consecutiveMinusCount < 1) {
      consecutiveMinusCount++;
      currentValue = "-";
      updateDisplay(currentValue);
      updateHistory(historyDisplay.textContent + op);
      lastInputWasOperator = true;
      return;
    } else {
      return;
    }
  }

  // Prevent "+" or any operator other than "-" from starting the calculation
  if (
    (op === "+" || op === "*" || op === "/") &&
    !num1 &&
    (!currentValue || currentValue === "-" || currentValue === ".")
  ) {
    return; // Ignore "+" or other operators if it’s the first input
  }

  // Allow up to two "-" characters in a row after an operator for cases like "8 * --6"
  if (op === "-" && lastInputWasOperator) {
    if (consecutiveMinusCount < 1) {
      consecutiveMinusCount++;
      currentValue += "-";
      updateDisplay(currentValue);
      updateHistory(historyDisplay.textContent + op);
      lastInputWasOperator = true;
      return;
    } else {
      // Prevent more than two "-" in a row after an operator
      return;
    }
  }

  // Reset consecutive "-" count when a different operator is clicked
  if (op !== "-") {
    consecutiveMinusCount = 0;
  }

  // Special case: If the calculation started with "-" and another operator is entered
  if (isStartingNegative && lastInputWasOperator && currentValue === "-") {
    if (op === "+" || op === "*" || op === "/") {
      operator = op;
      lastInputWasOperator = true;
      isStartingNegative = false; // Reset the starting negative flag after setting the operator
      return; // Skip updating the history to prevent it from showing the new operator
    }
  }

  // General case: If an operator is clicked right after another, replace the previous one
  if (lastInputWasOperator) {
    operator = op;
    historyDisplay.textContent =
      historyDisplay.textContent.slice(0, -2) + ` ${op} `;
    return;
  }

  // Reset if a calculation was completed
  if (calculationComplete) {
    num1 = parseFloat(display.textContent);
    calculationComplete = false;
    currentValue = "";
    consecutiveMinusCount = 0;
    isStartingNegative = false;
  }

  // Process the current input if available
  if (num1 !== undefined && currentValue !== "") {
    num2 = parseFloat(currentValue);
    let result = operate(operator, num1, num2);

    if (typeof result === "string") {
      updateDisplay(result);
      resetForNextCalculation();
      return;
    }
    updateDisplay(result);
    num1 = result;
  } else if (currentValue !== "") {
    num1 = parseFloat(currentValue);
  }

  // Set up for the next operation
  operator = op;
  currentValue = "";
  isDecimal = false;

  // Only update history if we are not handling the special starting negative case
  if (!(isStartingNegative && currentValue === "-")) {
    updateHistory(formatHistoryValue(`${historyDisplay.textContent} ${op} `));
  }

  awaitingNegativeOperand = false;
  lastInputWasOperator = true;
  lastButtonWasEquals = false;
  consecutiveMinusCount = 0; // Reset count after setting the operator
}

function resetForNextCalculation() {
  currentValue = "";
  operator = undefined;
  isDecimal = false;
  awaitingNegativeOperand = false;
  calculationComplete = false;
  lastButtonWasEquals = false;
  isStartingNegative = false; // Reset starting negative flag
  consecutiveMinusCount = 0; // Reset consecutive minus count
}

// Reset Functionality
function handleClearClick() {
  currentValue = "";
  num1 = undefined;
  num2 = undefined;
  operator = undefined;
  isDecimal = false;
  calculationComplete = false;
  awaitingNegativeOperand = false;
  updateDisplay("0");
  updateHistory("");
  lastButtonWasEquals = false;
  isStartingNegative = false; // Reset starting negative flag
  consecutiveMinusCount = 0; // Reset consecutive minus count
}

function handleDeleteClick() {
  if (currentValue.slice(-1) === ".") isDecimal = false;
  currentValue = currentValue.slice(0, -1) || "0";
  updateDisplay(currentValue);
  historyDisplay.textContent = historyDisplay.textContent.slice(0, -1);
}

// Event Listeners
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.textContent;
    if (buttonText >= "0" && buttonText <= "9") {
      if (calculationComplete) {
        handleClearClick();
      }
      handleDigitClick(buttonText);
    } else if (buttonText === ".") {
      if (calculationComplete) {
        handleClearClick();
      }
      handleDigitClick(buttonText);
    } else if (["+", "-", "*", "/"].includes(buttonText)) {
      if (calculationComplete) {
        calculationComplete = false;
        num2 = parseFloat(currentValue);
      }
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
    if (calculationComplete) {
      handleClearClick();
    }
    handleDigitClick(key);
  } else if (key === ".") {
    if (calculationComplete) {
      handleClearClick();
    }
    handleDigitClick(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    if (calculationComplete) {
      calculationComplete = false;
      num2 = parseFloat(currentValue);
    }
    handleOperatorClick(key);
  } else if (key === "Enter") {
    event.preventDefault();
    handleEqualsClick();
  } else if (key === "Escape") {
    handleClearClick();
  } else if (key === "Backspace") {
    handleDeleteClick();
  }
});
