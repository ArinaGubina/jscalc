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

console.log( typeof(money) );
console.log( typeof(income) );
console.log( typeof(deposit) );

console.log(addExpenses.length);

console.log('Период равен ' + period + ' месяцев');
console.log('Цель заработать ' + mission + ' рублей');

addExpenses = addExpenses.toLocaleLowerCase();
addExpenses = addExpenses.split(',');
for (let i = 0; i < addExpenses.length; i++) {
    console.log(addExpenses[i]);
}

let budgetMonth = money - amount1 - amount2;
console.log('Бюджет на месяц: ' + budgetMonth);

let budgetDay = Math.floor(budgetMonth/30);
console.log('Бюджет на день: ' + budgetDay);

let realPeriod = Math.ceil(mission/budgetMonth);
console.log('Цель будет достигнута за ' + realPeriod + ' месяцев');

if (budgetDay > 1200) {
    console.log('У вас высокий уровень дохода');
} else if (budgetDay > 600) {
    console.log('У вас средний уровень дохода');
} else if (budgetDay > 0) {
    console.log('К сожалению у вас уровень дохода ниже среднего');
} else {
    console.log('Что то пошло не так');
}