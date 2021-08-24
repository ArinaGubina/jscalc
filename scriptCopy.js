'use strict';

let regex = /[^А-Яа-яЁё\s,.?*"!:;()-]/g; // регулярка только русские буквы и знаки препинания
let regexNum = /[^0-9]/; // регулярка только цифры

let btnCalc = document.getElementById('start');
let btnCancel = document.getElementById('cancel');
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
let periodAmount = document.querySelector('.period-amount');

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
        console.log(this);
        let resultTotal = document.querySelectorAll('.result-total');
        resultTotal.forEach( function(item) {
            item.value = '';
        });
        if (salaryAmount.value === '') {
            alert('Ошибка. Поле "Месячный доход" должно быть заполнено!');
            return;
        }
        this.budget = +salaryAmount.value;
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAccumulatedMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();

        this.showResult();
        this.showRestart();
    },
    restart: function() {
        let allInputs = document.querySelectorAll('input[type="text"]');
        allInputs.forEach(function(item) {
            if ( !item.classList.contains('result-total') ) {
                item.disabled = false;
            }
            item.value = '';
        });

        for (let i = incomeItem.length-1; i>0; i--) {
            incomeItem[i].remove();
            incomeItem = document.querySelectorAll('.income-items');
        }
        btnPlus1.style.display = 'block';

        for (let i = expensesItems.length-1; i>0; i--) {
            expensesItems[i].remove();
            expensesItems = document.querySelectorAll('.expenses-items');
        }
        btnPlus2.style.display = 'block';

        checkbox.checked = false;
        periodSelect.value = 1;
        this.changePeriodAmount();

        btnCalc.setAttribute('style', 'display: block;');
        btnCancel.setAttribute('style', 'display: none;');
    },
    showRestart: function() {
        let textInputs = document.querySelector('.data').querySelectorAll('input[type="text"]');
        textInputs.forEach(function(item) {
            item.disabled = true;
        });
        btnPlus1.disabled = true;
        btnPlus2.disabled = true;
        checkbox.disabled = true;
        
        btnCalc.setAttribute('style', 'display: none;');
        btnCancel.setAttribute('style', 'display: block;');
    },
    showResult: function() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionaIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = this.getTargetMonth();
        incomePeriodValue.value = this.calcPeriod();
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

        this.incomeMonth = 0;
        for (let key in this.income) {
            this.incomeMonth += +this.income[key];
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
        for (let i = 0; i < this.addExpenses.length; i++) {
            this.addExpenses[i] = this.addExpenses[i].trim();
            this.addExpenses[i] = this.addExpenses[i][0].toLocaleUpperCase() + this.addExpenses[i].slice(1);
        }
    },
    getAccumulatedMonth: function(){
        this.expensesMonth = 0;
        for (const key in this.expenses) {
            this.expensesMonth += +this.expenses[key];
        }
    },
    getBudget: function() {
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    },
    getStatusIncome: function() {
        if (this.budgetDay > 1200) {
            return 'У вас высокий уровень дохода';
        } else if (this.budgetDay > 600) {
            return 'У вас средний уровень дохода';
        } else if (this.budgetDay > 0) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Что то пошло не так';
        }
    },
    getTargetMonth: function() {
        return Math.ceil(targetAmount.value/this.budgetMonth);
    },
    getInfoDeposit: function() {
        if (this.deposit) {
            do {
                this.percentDeposit = prompt("Какой годовой процент?", 3);
            } while( !isNumber(this.percentDeposit) );
            
            do {
                this.moneyDeposit = prompt("Какая сумма заложена?", 10000);
            } while( !isNumber(this.percentDeposit) );
        }
    },
    calcPeriod: function() {
        return this.budgetMonth * periodSelect.value;
    },
    changePeriodAmount: function() {
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
btnCalc.addEventListener('click', function() {
    appData.start();
});
btnPlus1.addEventListener('click', function() {
    appData.addIncomeBlock();
});
btnPlus2.addEventListener('click', function() {
    appData.addExpensesBlock();
});
periodSelect.addEventListener('input', function() {
    appData.changePeriodAmount();
});
btnCancel.addEventListener('click', function() {
    appData.restart();
});

let rus = document.querySelectorAll('[placeholder="Наименование"]'); // Получаем все поля с Наименованием
rus.forEach( function(item) {
    item.oninput = function(){
        this.value = this.value.replace(regex, '');
    };
});

let sum = document.querySelectorAll('[placeholder="Сумма"]'); // Получаем все поля с Суммой
sum.forEach( function(item) {
    item.oninput = function(){
        this.value = this.value.replace(regexNum, '');
    };
});