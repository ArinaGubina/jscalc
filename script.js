'use strict';

let isNumber = function(n) {
    return !isNaN( parseFloat(n) ) && isFinite(n);
};

let money = 0,
    income = 'репетиторство',
    addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', ''),
    deposit = confirm('Есть ли у вас депозит в банке?'),
    mission = 1000000,
    period = 12;

console.log(addExpenses.length);
console.log('Период равен ' + period + ' месяцев');
console.log('Цель заработать ' + mission + ' рублей');

addExpenses = addExpenses.toLocaleLowerCase();
addExpenses = addExpenses.split(',');
for (let i = 0; i < addExpenses.length; i++) {
    console.log(addExpenses[i]);
}

let start = function() {
    do {
        money = +prompt('Ваш месячный доход?');
    } while( !isNumber(money) );
};

let showTypeOf = function(data) {
    console.log(data, typeof(data) );
};

start();

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);

function getExpensesMonth() {
    let sum = 0;
    
    for (let i = 0; i < 2; i++) {
        if (i === 0) {
            let expenses1 = prompt('Введите обязательную статью расходов', '');
        } else {
            let expenses2 = prompt('Введите обязательную статью расходов', '');
        }

        let temp = 0;
        do {
            temp = +prompt('Во сколько это обойдётся?');
        } while( !isNumber(temp) );
        sum += temp;
    }
    return sum;
}

let expensesAmount = getExpensesMonth();

function getAccumulatedMonth() {
    return money - expensesAmount;
}

let accumulatedMonth = getAccumulatedMonth();

function getTargetMonth() {
    return Math.ceil(mission/accumulatedMonth);
}

console.log('Бюджет на месяц: ' + accumulatedMonth);

let budgetDay = Math.floor(accumulatedMonth / 30);
console.log('Бюджет на день: ' + budgetDay);

let realPeriod = getTargetMonth();
if (realPeriod >= 0) {
    console.log('Цель будет достигнута за ' + realPeriod + ' месяцев');
} else {
    console.log('Цель не будет достигнута');
}

let getStatusIncome = function() {
    if (budgetDay > 1200) {
        return 'У вас высокий уровень дохода';
    } else if (budgetDay > 600) {
        return 'У вас средний уровень дохода';
    } else if (budgetDay > 0) {
        return 'К сожалению у вас уровень дохода ниже среднего';
    } else {
        return 'Что то пошло не так';
    }
};

console.log( getStatusIncome() );
