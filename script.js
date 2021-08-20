'use strict';

let regex = /[^А-Яа-яЁё\s,.?*"!:;()-]/g; // регулярка только русские буквы и знаки препинания
let regexNum = /[^0-9]/; // регулярка только цифры

let btnCalc = document.getElementById('start');
let btnPlus1 = document.getElementsByTagName('button')[0];
let btnPlus2 = document.getElementsByTagName('button')[1];
let checkbox = document.querySelector('#deposit-check');
let budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
let budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
let expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
let additionaIncomeValue = document.getElementsByClassName('additional_income-value')[0];
let additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
let incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
let targetMonthValue = document.getElementsByClassName('target_month-value')[0];
let salaryAmount = document.querySelector('.salary-amount');
let incomeTitle = document.querySelector('.income-title');
let incomeItem = document.querySelectorAll('.income-items');
let expensesTitle = document.querySelector('.expenses-title');
let expensesAmount = document.querySelector('.expenses-amount');
let additionalExpensesItem = document.querySelector('.additional_expenses-item');
let targetAmount = document.querySelector('.target-amount');
let periodSelect = document.querySelector('[type="range"]');
let expensesItems = document.querySelectorAll('.expenses-items');
let additionalIncomeItem = document.querySelectorAll('.additional_income-item');
btnCalc.disabled = true; 
let isNumber = function(n) {
    return !isNaN( parseFloat(n) ) && isFinite(n);
};  

let appData = {
    budget: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    percentDeposit: 0,
    moneyDeposit: 0,
    start: function() {
        let resultTotal = document.querySelectorAll('.result-total');
        resultTotal.forEach( function(item) {
            item.value = '';
        });
        if (salaryAmount.value === '') {
            alert('Ошибка. Поле "Месячный доход" должно быть заполнено!');
            return;
        }
        appData.budget = +salaryAmount.value;
        appData.getExpenses();
        appData.getIncome();
        appData.getExpensesMonth();
        appData.getAccumulatedMonth();
        appData.getAddExpenses();
        appData.getAddIncome();
        appData.getBudget();

        appData.showResult();
    },
    showResult: function() {
        budgetMonthValue.value = appData.budgetMonth;
        budgetDayValue.value = appData.budgetDay;
        expensesMonthValue.value = appData.expensesMonth;
        additionalExpensesValue.value = appData.addExpenses.join(', ');
        additionaIncomeValue.value = appData.addIncome.join(', ');
        targetMonthValue.value = appData.getTargetMonth();
        incomePeriodValue.value = appData.calcPeriod();
        periodSelect.addEventListener('input', function(){
            incomePeriodValue.value = appData.calcPeriod();
        });
    },
    addExpensesBlock: function(){
        let cloneExpensesItem = expensesItems[0].cloneNode(true);
        let title = cloneExpensesItem.querySelector('.expenses-title');
        title.value = '';
        let val = cloneExpensesItem.querySelector('.expenses-amount');
        val.value = '';
        btnPlus2.parentNode.insertBefore(cloneExpensesItem, btnPlus2);
        expensesItems = document.querySelectorAll('.expenses-items');
        expensesItems[expensesItems.length - 1].querySelector('.expenses-title').oninput = function(){
            this.value = this.value.replace(regex, '');
        };
        expensesItems[expensesItems.length - 1].querySelector('.expenses-amount').oninput = function(){
            this.value = this.value.replace(regexNum, '');
        };
        if (expensesItems.length === 3) {
            btnPlus2.style.display = 'none';
        }
    },
    addIncomeBlock: function(){
        let cloneIncomeItem = incomeItem[0].cloneNode(true);
        let title = cloneIncomeItem.querySelector('.income-title');
        title.value = '';
        let val = cloneIncomeItem.querySelector('.income-amount');
        val.value = '';
        btnPlus1.parentNode.insertBefore(cloneIncomeItem, btnPlus1);
        incomeItem = document.querySelectorAll('.income-items');
        incomeItem[incomeItem.length - 1].querySelector('.income-title').oninput = function(){
            this.value = this.value.replace(regex, '');
        };
        incomeItem[incomeItem.length - 1].querySelector('.income-amount').oninput = function(){
            this.value = this.value.replace(regexNum, '');
        };
        if (incomeItem.length === 3) {
            btnPlus1.style.display = 'none';
        }
    },
    getExpenses: function() {
        expensesItems.forEach( function(item) {
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            
            if (itemExpenses !== '' && cashExpenses !== '') {
                appData.expenses[itemExpenses] = cashExpenses;
            }
        });
    },
    getIncome: function() {
        incomeItem.forEach( function(item) {
            let itemIncomne = item.querySelector('.income-title').value;
            let cashIncomne = item.querySelector('.income-amount').value;
            
            if (itemIncomne !== '' && cashIncomne !== '') {
                appData.income[itemIncomne] = cashIncomne;
            }
        });

        for (let key in appData.income) {
            appData.incomeMonth += +appData.income[key];
        }
    },
    getAddExpenses: function() {
        let addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach( function(item) {
            item = item.trim();
            if (item !== '') {
                appData.addExpenses.push(item);
            }
        });
    },
    getAddIncome: function() {
        additionalIncomeItem.forEach( function(item) {
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                appData.addIncome.push(itemValue);
            }
        });
    },
    getExpensesMonth: function(){
        for (let i = 0; i < appData.addExpenses.length; i++) {
            appData.addExpenses[i] = appData.addExpenses[i].trim();
            appData.addExpenses[i] = appData.addExpenses[i][0].toLocaleUpperCase() + appData.addExpenses[i].slice(1);
        }
    },
    getAccumulatedMonth: function(){
        for (const key in appData.expenses) {
            appData.expensesMonth += +appData.expenses[key];
        }
    },
    getBudget: function() {
        appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    getStatusIncome: function() {
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
    getTargetMonth: function() {
        return Math.ceil(targetAmount.value/appData.budgetMonth);
    },
    getInfoDeposit: function() {
        if (appData.deposit) {
            do {
                appData.percentDeposit = prompt("Какой годовой процент?", 3);
            } while( !isNumber(appData.percentDeposit) );
            
            do {
                appData.moneyDeposit = prompt("Какая сумма заложена?", 10000);
            } while( !isNumber(appData.percentDeposit) );
        }
    },
    calcPeriod: function() {
        return appData.budgetMonth * periodSelect.value;
    },
    changePeriodAmount: function() {
        let periodAmount = document.querySelector('.period-amount');
        periodAmount.innerHTML = periodSelect.value;
    }
};

salaryAmount.addEventListener('input', function() {
    if (salaryAmount.value !== '') {
        btnCalc.disabled = false;
    } else {
        btnCalc.disabled = true;
    }
});
btnCalc.addEventListener('click', appData.start);
btnPlus1.addEventListener('click', appData.addIncomeBlock);
btnPlus2.addEventListener('click', appData.addExpensesBlock);
periodSelect.addEventListener('input', appData.changePeriodAmount);

let rus = document.querySelectorAll('[placeholder="Наименование"]'); // Получаем все поля с Наименованием
rus.forEach( function(item) {
    item.oninput = function(){
        this.value = this.value.replace(regex, '');
    };
});

let sum = document.querySelectorAll('[placeholder="Сумма"]'); // Получаем все поля с Наименованием
sum.forEach( function(item) {
    item.oninput = function(){
        this.value = this.value.replace(regexNum, '');
    };
});