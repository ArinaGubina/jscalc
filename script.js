const money = 40000;
let income = 'репетиторство';
let addExpenses = 'Тест-полоски,Инсулин,Айпорты,Мониторинг';
let deposit = true;
let mission = 1000000; 
let period = 12;

console.log( typeof(money) );
console.log( typeof(income) );
console.log( typeof(deposit) );

console.log( typeof(addExpenses.length) );

console.log('Период равен ' + period + ' месяцев');
console.log('Цель заработать ' + mission + ' рублей');

addExpenses = addExpenses.toLocaleLowerCase();
addExpenses = addExpenses.split(',');
for (let i = 0; i < addExpenses.length; i++) {
    console.log(addExpenses[i]);
}

let budgetDay = money/30;
console.log(budgetDay);