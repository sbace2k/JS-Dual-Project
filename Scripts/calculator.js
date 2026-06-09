const input = document.getElementById('inputBox')
const calculator = document.querySelector('.calculator')

let expression = ''

const buttonMap = {
  '÷': '/',
  '×': '*',
  'π': 'Math.PI',
  'e': 'Math.E',
  'x^2': '**2',
  'x^3': '**3',
  'x^y': '**',
  '10^x': '10**(',
  '√x': 'Math.sqrt(',
  '∛x': 'Math.cbrt(',
  '|x|': 'Math.abs(',
  'sin': 'Math.sin(',
  'cos': 'Math.cos(',
  'tan': 'Math.tan(',
  'asin': 'Math.asin(',
  'acos': 'Math.acos(',
  'atan': 'Math.atan(',
  'log': 'Math.log10(',
  'ln': 'Math.log(',
  'e^x': 'Math.exp(',
  'x^-1': '**-1',
  'x!': '!',
  'y√x': 'Math.pow(',
}

const display = (value) => {
  input.value = value
}

const sanitizeExpression = (expr) => expr
  .replace(/÷/g, '/')
  .replace(/×/g, '*')
  .replace(/π/g, 'Math.PI')
  .replace(/(\d+)!/g, 'factorial($1)')

const factorial = (n) => {
  const value = Number(n)
  if (!Number.isInteger(value) || value < 0) return NaN
  let result = 1
  for (let i = 2; i <= value; i += 1) {
    result *= i
  }
  return result
}

const evaluateExpression = () => {
  if (!expression) return

  try {
    const result = Function(`"use strict"; return (${sanitizeExpression(expression)})`)()
    expression = Number.isFinite(result) ? String(result) : 'Syntax Error'
  } catch {
    expression = 'Syntax Error'
  }

  display(expression)
}

const clearAll = () => {
  expression = ''
  display('')
}

const deleteLast = () => {
  if (expression === 'Syntax Error') {
    expression = ''
  } else {
    expression = expression.slice(0, -1)
  }
  display(expression)
}

const toggleSign = () => {
  if (!expression) return
  expression = expression.startsWith('-') ? expression.slice(1) : `-${expression}`
  display(expression)
}

const applyPercent = () => {
  if (!expression) return
  expression = `(${expression})/100`
  evaluateExpression()
}

calculator.addEventListener('click', (event) => {
  const button = event.target.closest('button')
  if (!button) return

  const action = button.dataset.action
  const value = button.dataset.value ?? button.textContent.trim()

  if (action === 'delete') {
    deleteLast()
    return
  }

  if (value === 'AC') {
    clearAll()
    return
  }

  if (value === '=') {
    evaluateExpression()
    return
  }

  if (value === '%') {
    applyPercent()
    return
  }

  if (value === '±') {
    toggleSign()
    return
  }

  expression += buttonMap[value] ?? value
  display(expression)
})

input.addEventListener('input', (event) => {
  const sanitized = event.target.value.replace(/[^0-9+\-*/%^().!a-zA-Z ]/g, '')
  if (sanitized !== event.target.value) {
    event.target.value = sanitized
  }
  expression = sanitized
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    evaluateExpression()
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    clearAll()
  }
})
