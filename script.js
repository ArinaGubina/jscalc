'use strict';

const regex = /[^А-Яа-яЁё\s,.?*"!:;()-]/g; // регулярка только русские буквы и знаки препинания
const regexNum = /[^0-9]/; // регулярка только цифры

const btnCalc = document.getElementById('start');
const btnCancel = document.getElementById('cancel');
const btnPlus1 = document.getElementsByTagName('button')[0];
const btnPlus2 = document.getElementsByTagName('button')[1];
const checkbox = document.querySelector('#deposit-check');
const budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
const additionaIncomeValue = document.getElementsByClassName('additional_income-value')[0];
const additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
const targetMonthValue = document.getElementsByClassName('target_month-value')[0];
const salaryAmount = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-title');
let incomeItem = document.querySelectorAll('.income-items');
const expensesTitle = document.querySelector('.expenses-title');
const expensesAmount = document.querySelector('.expenses-amount');
const additionalExpensesItem = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('[type="range"]');
let expensesItems = document.querySelectorAll('.expenses-items');
const additionalIncomeItem = document.querySelectorAll('.additional_income-item');
const periodAmount = document.querySelector('.period-amount');
const rus = document.querySelectorAll('[placeholder="Наименование"]'); // Получаем все поля с Наименованием
const sum = document.querySelectorAll('[placeholder="Сумма"]'); // Получаем все поля с Суммой
const isNumber = function(n) {
    return !isNaN( parseFloat(n) ) && isFinite(n);
};  
const depositBank = document.querySelector('.deposit-bank');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');

class AppData {
    constructor() {
        this.budget = 0;
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;

        btnCalc.disabled = true;

        rus.forEach(function (item) {
            item.oninput = function () {
                this.value = this.value.replace(regex, '');
            };
        });

        sum.forEach(function (item) {
            item.oninput = function () {
                this.value = this.value.replace(regexNum, '');
            };
        });
        
        depositPercent.oninput = function () {
            this.value = this.value.replace(regexNum, '');
            if (this.value > 100) {
                this.value = 0;
            }
        };
    }
    start() {
        console.log(this);
        const resultTotal = document.querySelectorAll('.result-total');
        resultTotal.forEach(function (item) {
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
        this.getInfoDeposit();
        this.getBudget();

        this.showResult();
        this.showRestart();
    }
    restart() {
        const allInputs = document.querySelectorAll('input[type="text"]');
        allInputs.forEach(function (item) {
            if (!item.classList.contains('result-total')) {
                item.disabled = false;
            }
            item.value = '';
        });

        for (let i = incomeItem.length - 1; i > 0; i--) {
            incomeItem[i].remove();
            incomeItem = document.querySelectorAll('.income-items');
        }
        btnPlus1.style.display = 'block';
        btnPlus1.disabled = false;

        for (let i = expensesItems.length - 1; i > 0; i--) {
            expensesItems[i].remove();
            expensesItems = document.querySelectorAll('.expenses-items');
        }
        btnPlus2.style.display = 'block';
        btnPlus2.disabled = false;

        checkbox.checked = false;
        checkbox.disabled = false;
        periodSelect.value = 1;
        this.changePeriodAmount();

        btnCalc.setAttribute('style', 'display: block;');
        btnCancel.setAttribute('style', 'display: none;');
        depositBank.style.display = 'none';
        depositAmount.style.display = 'none';
        depositPercent.style.display = 'none';
    }
    showRestart() {
        const textInputs = document.querySelector('.data').querySelectorAll('input[type="text"]');
        textInputs.forEach(function (item) {
            item.disabled = true;
        });
        btnPlus1.disabled = true;
        btnPlus2.disabled = true;
        checkbox.disabled = true;

        btnCalc.setAttribute('style', 'display: none;');
        btnCancel.setAttribute('style', 'display: block;');
    }
    showResult() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionaIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = this.getTargetMonth();
        incomePeriodValue.value = this.calcPeriod();
        periodSelect.addEventListener('input', () => {
            incomePeriodValue.value = this.calcPeriod();
        });
    }
    addExpensesBlock() {
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        const title = cloneExpensesItem.querySelector('.expenses-title');
        title.value = '';
        const val = cloneExpensesItem.querySelector('.expenses-amount');
        val.value = '';
        btnPlus2.parentNode.insertBefore(cloneExpensesItem, btnPlus2);
        expensesItems = document.querySelectorAll('.expenses-items');
        expensesItems[expensesItems.length - 1].querySelector('.expenses-title').oninput = function () {
            this.value = this.value.replace(regex, '');
        };
        expensesItems[expensesItems.length - 1].querySelector('.expenses-amount').oninput = function () {
            this.value = this.value.replace(regexNum, '');
        };
        if (expensesItems.length === 3) {
            btnPlus2.style.display = 'none';
        }
    }
    addIncomeBlock() {
        const cloneIncomeItem = incomeItem[0].cloneNode(true);
        const title = cloneIncomeItem.querySelector('.income-title');
        title.value = '';
        const val = cloneIncomeItem.querySelector('.income-amount');
        val.value = '';
        btnPlus1.parentNode.insertBefore(cloneIncomeItem, btnPlus1);
        incomeItem = document.querySelectorAll('.income-items');
        incomeItem[incomeItem.length - 1].querySelector('.income-title').oninput = function () {
            this.value = this.value.replace(regex, '');
        };
        incomeItem[incomeItem.length - 1].querySelector('.income-amount').oninput = function () {
            this.value = this.value.replace(regexNum, '');
        };
        if (incomeItem.length === 3) {
            btnPlus1.style.display = 'none';
        }
    }
    getExpenses() {
        expensesItems.forEach((item) => {
            const itemExpenses = item.querySelector('.expenses-title').value;
            const cashExpenses = item.querySelector('.expenses-amount').value;

            if (itemExpenses !== '' && cashExpenses !== '') {
                this.expenses[itemExpenses] = cashExpenses;
            }
        });
    }
    getIncome() {
        incomeItem.forEach((item) => {
            const itemIncomne = item.querySelector('.income-title').value;
            const cashIncomne = item.querySelector('.income-amount').value;

            if (itemIncomne !== '' && cashIncomne !== '') {
                this.income[itemIncomne] = cashIncomne;
            }
        });

        this.incomeMonth = 0;
        for (let key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    }
    getAddExpenses() {
        const addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach((item) => {
            item = item.trim();
            if (item !== '') {
                this.addExpenses.push(item);
            }
        });
    }
    getAddIncome() {
        additionalIncomeItem.forEach((item) => {
            const itemValue = item.value.trim();
            if (itemValue !== '') {
                this.addIncome.push(itemValue);
            }
        });
    }
    getExpensesMonth() {
        for (let i = 0; i < this.addExpenses.length; i++) {
            this.addExpenses[i] = this.addExpenses[i].trim();
            this.addExpenses[i] = this.addExpenses[i][0].toLocaleUpperCase() + this.addExpenses[i].slice(1);
        }
    }
    getAccumulatedMonth() {
        this.expensesMonth = 0;
        for (const key in this.expenses) {
            this.expensesMonth += +this.expenses[key];
        }
    }
    getBudget() {
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    }
    getStatusIncome() {
        if (this.budgetDay > 1200) {
            return 'У вас высокий уровень дохода';
        } else if (this.budgetDay > 600) {
            return 'У вас средний уровень дохода';
        } else if (this.budgetDay > 0) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Что то пошло не так';
        }
    }
    getTargetMonth() {
        return Math.ceil(targetAmount.value / this.budgetMonth);
    }
    getInfoDeposit() {
        if (this.deposit) {
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
            this.percentDeposit = depositPercent.value;
        }
    }
    calcPeriod() { return this.budgetMonth * periodSelect.value; }
    changePeriodAmount() { periodAmount.innerHTML = periodSelect.value; }
    changePercent() {
        const valueSelect = this.value;
        if (valueSelect === 'other') {
            depositPercent.style.display = 'inline-block';
        } else {
            depositPercent.value = valueSelect;
        }
    }
    depositHandler() {
        if (checkbox.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent);
        } else {
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositPercent.style.display = 'none';
            depositBank.value = '';
            depositAmount.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent);
        }
    }
    eventListeners() {
        salaryAmount.addEventListener('input', () => {
            if (salaryAmount.value !== '') {
                btnCalc.disabled = false;
            } else {
                btnCalc.disabled = true;
            }
        });
        btnCalc.addEventListener('click', () => { this.start(); });
        btnPlus1.addEventListener('click', () => { this.addIncomeBlock(); });
        btnPlus2.addEventListener('click', () => { this.addExpensesBlock(); });
        periodSelect.addEventListener('input', () => { this.changePeriodAmount(); });
        btnCancel.addEventListener('click', () => { this.restart(); });

        checkbox.addEventListener('change', this.depositHandler.bind(this));
    }
}


const appData = new AppData();
console.log(appData);
appData.eventListeners();