'use strict';

let btnCalc = document.getElementById('start');
console.log(btnCalc);

let btnPlus1 = document.getElementsByTagName('button')[0];
console.log(btnPlus1);

let btnPlus2 = document.getElementsByTagName('button')[1];
console.log(btnPlus1);

let checkbox = document.querySelector('#deposit-check');
console.log(checkbox);

let income = document.querySelectorAll('.additional_income-item');
console.log(income);

let budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
console.log(budgetMonthValue);

let budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
console.log(budgetDayValue);

let expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
console.log(expensesMonthValue);

let additionaIncomeValue = document.getElementsByClassName('additional_income-value')[0];
console.log(additionaIncomeValue);

let additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
console.log(additionalExpensesValue);

let incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
console.log(incomePeriodValue);

let targetMonthValue = document.getElementsByClassName('target_month-value')[0];
console.log(targetMonthValue);

let salaryAmount = document.querySelector('.salary-amount');
console.log(salaryAmount);

let incomeTitle = document.querySelector('.income-title');
console.log(incomeTitle);

let incomeAmount = document.querySelector('.income-amount');
console.log(incomeAmount);

let expensesTitle = document.querySelector('.expenses-title');
console.log(expensesTitle);

let expensesAmount = document.querySelector('.expenses-amount');
console.log(expensesAmount);

let additionalExpensesItem = document.querySelector('.additional_expenses-item');
console.log(additionalExpensesItem);

let targetAmount = document.querySelector('[type="range"]');
console.log(targetAmount);

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
    percentDeposit : 0,
    moneyDeposit : 0,
    asking : function(){
        if ( confirm("Есть ли у вас дополнительный заработок?") ) {
            
            let itemIncome;
            do {
                itemIncome = prompt("Какой у вас есть дополнительный заработок?", "Репетиторство");
            } while( isNumber(+itemIncome) );
            let cashIncome;
            do {
                cashIncome = prompt("Сколько в месяц вы на этом зарабатываете?", 0);
            } while( !isNumber(+cashIncome) );
            appData.income[itemIncome] = cashIncome;
        }

        let addExpenses = prompt('Перечислите возможные расходы '+
        'за рассчитываемый период через запятую', '');            
            appData.addExpenses = addExpenses.toLocaleLowerCase().split(',');
            appData.deposit = confirm('Есть ли у вас депозит в банке?');
        let exp = {};
        
        for (let i = 0; i < 2; i++) {
            let expTitle;
            do {
                expTitle = prompt('Введите обязательную статью расходов', '');
            } while( isNumber(expTitle) );
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
            appData.addExpenses[i] = appData.addExpenses[i].trim();
            appData.addExpenses[i] = appData.addExpenses[i][0].toLocaleUpperCase() + appData.addExpenses[i].slice(1);
        }
        console.log( appData.addExpenses.join(', ') );
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
    },
    getInfoDeposit : function() {
        if (appData.deposit) {
            do {
                appData.percentDeposit = prompt("Какой годовой процент?", 3);
            } while( !isNumber(appData.percentDeposit) );
            
            do {
                appData.moneyDeposit = prompt("Какая сумма заложена?", 10000);
            } while( !isNumber(appData.percentDeposit) );
        }
    },
    calcSavedMoney : function() {
        return appData.budgetMonth * appData.period;
    }
};

// start();
// appData.budget = money;
// appData.asking();

// console.log(appData.addExpenses.length);
// console.log('Период равен ' + appData.period + ' месяцев');
// console.log('Цель заработать ' + appData.mission + ' рублей');

// appData.getExpensesMonth();
// appData.getAccumulatedMonth();
// appData.getBudget();

// console.log('Бюджет на месяц: ' + appData.budgetMonth);
// console.log('Бюджет на день: ' + appData.budgetDay);

// if (appData.getTargetMonth() >= 0) {
//     console.log('Цель будет достигнута за ' + appData.getTargetMonth() + ' месяцев');
// } else {
//     console.log('Цель не будет достигнута');
// }

// console.log( appData.getStatusIncome() );

// console.log('Наша программа включает в себя данные:');
// for (const key in appData) {
//     if (Object.hasOwnProperty.call(appData, key)) {
//         console.log('Свойство: ' + key + ', значение: '+ appData[key]);
//     }
// }