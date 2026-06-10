const input = document.getElementById('inputBox')
const calculator = document.querySelector('.calculator')
const scientificToggle = document.getElementById('scientific-toggle')
const scientificSection = document.getElementById('scientific-section')

let expression = ''

const buttonMap = {
  '÷': '/',
  '×': '*',
  'π': 'π',
  'e': 'e',
  'x^2': '^2',
  'x^3': '^3',
  'x^y': '^(',
  '10^x': '10^(',
  '√x': 'sqrt(',
  '∛x': 'cbrt(',
  '|x|': 'abs(',
  'sin': 'sin(',
  'cos': 'cos(',
  'tan': 'tan(',
  'asin': 'asin(',
  'acos': 'acos(',
  'atan': 'atan(',
  'log': 'log(',
  'ln': 'ln(',
  'e^x': 'exp(',
  'x^-1': '^-1',
  'x!': '!',
  'y√x': 'pow(',
}

const MAX_FONT_SIZE = 40
const MIN_FONT_SIZE = 18

const adjustFontSize = () => {
  const style = window.getComputedStyle(input)
  const paddingLeft = parseFloat(style.paddingLeft) || 0
  const paddingRight = parseFloat(style.paddingRight) || 0
  const availableWidth = input.clientWidth - paddingLeft - paddingRight
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  let size = MAX_FONT_SIZE
  const fontFamily = style.fontFamily || 'sans-serif'
  const fontWeight = style.fontWeight || '400'
  const text = input.value || input.placeholder || ''

  while (size >= MIN_FONT_SIZE) {
    context.font = `${fontWeight} ${size}px ${fontFamily}`
    const textWidth = context.measureText(text).width
    if (textWidth <= availableWidth) break
    size -= 1
  }

  input.style.fontSize = `${Math.max(size, MIN_FONT_SIZE)}px`
}

const display = (value) => {
  input.value = value
  adjustFontSize()
}

const sanitizeExpression = (expr) => expr
  .replace(/÷/g, '/')
  .replace(/×/g, '*')
  .replace(/π/g, 'Math.PI')
  .replace(/sin\(/g, 'Math.sin(')
  .replace(/cos\(/g, 'Math.cos(')
  .replace(/tan\(/g, 'Math.tan(')
  .replace(/asin\(/g, 'Math.asin(')
  .replace(/acos\(/g, 'Math.acos(')
  .replace(/atan\(/g, 'Math.atan(')
  .replace(/log\(/g, 'Math.log10(')
  .replace(/ln\(/g, 'Math.log(')
  .replace(/exp\(/g, 'Math.exp(')
  .replace(/\be\b/g, 'Math.E')
  .replace(/abs\(/g, 'Math.abs(')
  .replace(/sqrt\(/g, 'Math.sqrt(')
  .replace(/cbrt\(/g, 'Math.cbrt(')
  .replace(/pow\(/g, 'Math.pow(')
  .replace(/(\d+)!/g, 'factorial($1)')
  .replace(/\^\(/g, '**(')
  .replace(/\^2/g, '**2')
  .replace(/\^3/g, '**3')
  .replace(/10\^\(/g, '10**(')
  .replace(/\^\-1/g, '**-1')

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
    const tokens = [
      'asin(', 'acos(', 'atan(', 'sqrt(', 'cbrt(', '10^(', 'pow(',
      'log(', 'exp(', 'abs(', 'sin(', 'cos(', 'tan(', 'ln(',
      '^-1', '^3', '^2', '^('
    ]
    const match = tokens.find((token) => expression.endsWith(token))
    expression = match
      ? expression.slice(0, -match.length)
      : expression.slice(0, -1)
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
  
  if (action === 'toggle-scientific') {
    scientificSection.classList.toggle('collapsed')
    scientificToggle.textContent = scientificSection.classList.contains('collapsed') 
      ? 'Show less ▲' 
      : 'Show more ▼'
    return
  }

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
  adjustFontSize()
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
