class CurrencyConverter {
    dollarToEuro(amount) { return amount * 0.92; }
    bolivarToDollar(amount) { return amount * 0.00025; }
    // add other currencies here
}

module.exports = CurrencyConverter;