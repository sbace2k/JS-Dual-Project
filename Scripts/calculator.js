let input = document.getElementById('inputBox')
// Only select buttons inside the calculator to avoid picking other page buttons
let buttons = document.querySelectorAll('.calculator button')

let string = ""
const operators = ['+', '-', '*', '/', '%']

const updateDisplay = () => {
  input.value = string
}

const appendChar = (char) => {
  if (string === "Syntax Error") string = ""
  const lastChar = string[string.length - 1]

  // Prevent starting with invalid operators
  if (string.length === 0 && (char === '*' || char === '/' || char === '%')) {
    string = "Syntax Error"
    updateDisplay()
    return
  }

  // Prevent consecutive operators
  if (operators.includes(char) && operators.includes(lastChar)) return

  string += char
  updateDisplay()
}

const clearAll = () => {
  string = ""
  updateDisplay()
}

const deleteLast = () => {
  if (string === "Syntax Error") {
    string = ""
  } else {
    string = string.substring(0, string.length - 1)
  }
  updateDisplay()
}

const evaluateExpression = () => {
  try {
    // Avoid evaluating empty string
    if (!string) return
    // Evaluate safely
    const result = eval(string)
    if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
      string = "Syntax Error"
    } else {
      string = String(result)
    }
  } catch (e) {
    string = "Syntax Error"
  }
  updateDisplay()
}

// Button clicks
let arr = Array.from(buttons)
arr.forEach(button => {
  button.addEventListener('click', (e) => {
    const val = e.target.innerText.trim()
    if (val === '=') {
      evaluateExpression()
    } else if (val === 'AC') {
      clearAll()
    } else if (val === 'DEL') {
      deleteLast()
    } else {
      appendChar(val)
    }
  })
})

// Handle direct typing into the input: sanitize allowed characters
input.addEventListener('input', (e) => {
  // Allow digits, operators, dot and percent
  const sanitized = e.target.value.replace(/[^0-9+\-*/%.]/g, '')
  if (sanitized !== e.target.value) {
    e.target.value = sanitized
  }
  string = sanitized
})

// Keyboard shortcuts: Enter = evaluate, Backspace = DEL, Escape = AC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    evaluateExpression()
  } else if (e.key === 'Backspace') {
    // Let Backspace work in the input naturally; also update string accordingly
    // No need to preventDefault here
    // Delay reading input value to let the input update
    setTimeout(() => { string = input.value }, 0)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    clearAll()
  } else {
    // For other keys, we allow input's input listener to handle sanitization
  }
})