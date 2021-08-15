'use strict';

let isNumber = function(n) {
    return !isNaN( parseFloat(n) ) && isFinite(n);
};

let money,
    start = function() {
    do {
        money = +prompt('Ваш месячный доход?');
    } while( !isNumber(money) );
};



let appData = {
    income : {},
    addIncome : [],
    expenses : {},
    addExpenses : [],
    deposit : false,
    mission : 1000000,
    period : 12,
    budgetDay : 0,
    budgetMonth : 0,
    expensesMonth : 0,
    asking : function(){
    let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', '');            
            appData.addExpenses = addExpenses.toLocaleLowerCase().split(',');
            appData.deposit = confirm('Есть ли у вас депозит в банке?');
            let exp = {};
            
            for (let i = 0; i < 2; i++) {
                let expTitle = prompt('Введите обязательную статью расходов', '');
                let temp = 0;
                do {
                    temp = +prompt('Во сколько это обойдётся?');
                } while( !isNumber(temp) );
                exp[expTitle] = temp;
            }
            appData.expenses = exp;
    },
    getExpensesMonth : function(){
        for (let i = 0; i < appData.addExpenses.length; i++) {
            console.log(appData.addExpenses[i]);
        }
    },
    getAccumulatedMonth : function(){
        for (const key in appData.expenses) {
            appData.expensesMonth += appData.expenses[key];
        }
    },
    getBudget : function() {
        appData.budgetMonth = appData.budget - appData.expensesMonth;
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    getStatusIncome : function() {
        if (appData.budgetDay > 1200) {
            return 'У вас высокий уровень дохода';
        } else if (appData.budgetDay > 600) {
            return 'У вас средний уровень дохода';
        } else if (appData.budgetDay > 0) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Что то пошло не так';
        }
    },
    getTargetMonth : function() {
        return Math.ceil(appData.mission/appData.budgetMonth);
    }
};

start();
appData.budget = money;
appData.asking();

console.log(appData.addExpenses.length);
console.log('Период равен ' + appData.period + ' месяцев');
console.log('Цель заработать ' + appData.mission + ' рублей');

appData.getExpensesMonth();
appData.getAccumulatedMonth();
appData.getBudget();

console.log('Бюджет на месяц: ' + appData.budgetMonth);
console.log('Бюджет на день: ' + appData.budgetDay);

if (appData.getTargetMonth() >= 0) {
    console.log('Цель будет достигнута за ' + appData.getTargetMonth() + ' месяцев');
} else {
    console.log('Цель не будет достигнута');
}

console.log( appData.getStatusIncome() );

console.log('Наша программа включает в себя данные:');
for (const key in appData) {
    if (Object.hasOwnProperty.call(appData, key)) {
        console.log('Свойство: ' + key + ', значение: '+ appData[key]);
    }
}