class Calculator {
    add(a, b) { return a + b; }
    substract(a, b) { return a - b; }
    divide(a, b) {return b !== 0 ? a/b: 'Error: Division por cero'; }
}

module.exports = Calculator;