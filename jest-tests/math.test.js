const { calcTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math')

test('calculate total with tip' , () => {
    const total = calcTip(12, .5);
    expect(total).toBe(18)
    // if(total !== 18){
    //     throw new Error('Total should 18. Got ' + total);
    // }
});

test('default', () =>  {
    expect(calcTip(12)).toBe(14.4)
});

test('Should convert 32 F to 0 C', () => {
    expect(fahrenheitToCelsius(32)).toBe(0)
});

test('Should convert 0 C to 32 F', () => {
    expect(celsiusToFahrenheit(0)).toBe(31)
});