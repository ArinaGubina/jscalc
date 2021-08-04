'use strict';

let money = +prompt('Ваш месячный доход?', 0);
let income = 'репетиторство';
let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', '');
let deposit = confirm('Есть ли у вас депозит в банке?');

let expenses1 = prompt('Введите обязательную статью расходов?', '');
let amount1 = +prompt('Во сколько это обойдется?', 0);
let expenses2 = prompt('Введите обязательную статью расходов?', '');
let amount2 = +prompt('Во сколько это обойдется?', 0);

let mission = 1000000; 
let period = 12;

console.log(addExpenses.length);

console.log('Период равен ' + period + ' месяцев');
console.log('Цель заработать ' + mission + ' рублей');

addExpenses = addExpenses.toLocaleLowerCase();
addExpenses = addExpenses.split(',');
for (let i = 0; i < addExpenses.length; i++) {
    console.log(addExpenses[i]);
}

let showTypeOf = function(data) {
    console.log(data, typeof(data) );
};

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);

function getExpensesMonth() {
    return amount1 + amount2;
}

function getAccumulatedMonth() {
    return money - getExpensesMonth();
}

let accumulatedMonth = getAccumulatedMonth();

function getTargetMonth() {
    return Math.ceil(mission/accumulatedMonth);
}

console.log('Бюджет на месяц: ' + accumulatedMonth);

let budgetDay = Math.floor(accumulatedMonth / 30);
console.log('Бюджет на день: ' + budgetDay);

let realPeriod = Math.ceil(mission / accumulatedMonth);
console.log('Цель будет достигнута за ' + realPeriod + ' месяцев');

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
