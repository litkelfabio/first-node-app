const calcTip = (total, tipPercent = 0.2) => total + (total * tipPercent)

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const add = (n1, n2) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(n1 + n2);
        }, 2000);
    })
}

module.exports = {
    calcTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}