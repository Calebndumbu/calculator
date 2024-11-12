let num1;
let operator;
let num2;

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
  if (b === 0) {
    return `Error: Division by zero`;
  }
  return a / b;
}

function operate(operator, num1, num2) {
  if (operator === "+") {
    return add(num1, num2);
  } else if (operator === "-") {
    return subtract(num1, num2);
  } else if (operator === "*") {
    return multiply(num1, num2);
  } else if (operator === "/") {
    return divide(num1, num2);
  } else {
    return "Error: Invalid operator";
  }
}

//get the display element

const display = document.getElementById("display");

//variable to store the current value on the display
let currentvalue = "";

//function to update the display with the current value
function updateDisplay(value) {
  display.textContent = value;
}

//function to handle digit clicks
function handleDigitClick(digit) {
  currentvalue += digit;
  updateDisplay(currentvalue);
}
//add event listeners to all digit buttons
const digitButtons = document.querySelectorAll(".btn");

digitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.textContent;
    if (buttonText >= "0" && buttonText <= "9") {
      handleDigitClick(buttonText);
    }
  });
});
