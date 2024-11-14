// Variables
let num1;
let operator;
let num2;
let currentValue = "";
let lastInputWasOperator = false;
let isDecimal = false;
let calculationComplete = false;
let awaitingNegativeOperand = false;

// Display Handling
const display = document.getElementById("current");
const historyDisplay = document.getElementById("history");

function updateDisplay(value) {
  display.textContent =
    typeof value === "number" ? parseFloat(value.toFixed(4)) : value;
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
  if (awaitingNegativeOperand && digit === "-") {
    currentValue = "-";
    updateDisplay(currentValue);
    updateHistory(historyDisplay.textContent + digit);
    awaitingNegativeOperand = false;
    lastInputWasOperator = false;
    return;
  }
  if (currentValue === "0" && digit !== ".") currentValue = "";
  if (digit === "." && isDecimal) return;
  if (digit === ".") isDecimal = true;

  currentValue += digit;
  updateDisplay(currentValue);
  updateHistory(historyDisplay.textContent + digit);
  lastInputWasOperator = false;
}

function handleEqualsClick() {
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
  } else {
    updateDisplay("Error");
    resetForNextCalculation();
  }
  lastInputWasOperator = false;
}

function handleOperatorClick(op) {
  if (op === "-" && currentValue === "" && !num1) {
    currentValue = "-";
    updateDisplay(currentValue);
    updateHistory(currentValue);
    return;
  }
  if (lastInputWasOperator) {
    if (op === "-" && currentValue === "") {
      awaitingNegativeOperand = true;
      handleDigitClick(op);
    }
    return;
  }
  if (calculationComplete) {
    num1 = parseFloat(display.textContent);
    calculationComplete = false;
    currentValue = "";
  }
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

  operator = op;
  currentValue = "";
  isDecimal = false;
  updateHistory(`${historyDisplay.textContent} ${op} `);
  awaitingNegativeOperand = false;
  lastInputWasOperator = true;
}

function resetForNextCalculation() {
  currentValue = "";
  operator = undefined;
  isDecimal = false;
  awaitingNegativeOperand = false;
  calculationComplete = false;
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
      num1 = parseFloat(currentValue);
    }
    handleOperatorClick(key);
  } else if (key === "Enter") {
    handleEqualsClick();
  } else if (key === "Escape") {
    handleClearClick();
  } else if (key === "Backspace") {
    handleDeleteClick();
  }
});
