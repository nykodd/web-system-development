import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
  <h1>Dali & Dima's Expense Tracker</h1>
  <form name="myForm" onsubmit="return validateForm()" method="post">
    <input type="text" name="expense-name" id="expense-name" placeholder="Enter expense name">
    <input type="number" name="expense-amount" id="expense-amount" placeholder="Enter expense amount">
    <button id="add-expense">Add Expense</button>
    </form>
    <p>Expense list:</p>
    <div id="expense-list"></div>
    <p>Total expenses: <span id="total">0</span></p>
  </div>
`

function validateForm() {
  let expenseName = document.querySelector('#expense-name').value;
  if (expenseName == "") {
    alert("Expense name must be filled out");
    return false;
  }
  let expenseAmount = document.querySelector('#expense-amount').value;
  if (expenseAmount <= 0) {
    alert("Expense amount must be filled out");
    return false;
  }
  return true;
}

function totalExpenses() {
  let expenseItems = document.querySelectorAll('#expense-list li');
  let total = 0;
  expenseItems.forEach(expense => {
    // Extract the amount from "name - amount" format
    let text = expense.textContent;
    let amount = parseFloat(text.split(' - ')[1]);
    total += amount;
  });
  document.querySelector('#total').innerHTML = total;
}

document.querySelector('#add-expense').addEventListener('click', (event) => {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  const expenseName = document.querySelector('#expense-name').value;
  const expenseAmount = document.querySelector('#expense-amount').value;
  const expenseList = document.querySelector('#expense-list');
  expenseList.innerHTML += `<li>${expenseName} - ${expenseAmount}</li>`;
  document.querySelector('#expense-amount').value = '';
  document.querySelector('#expense-name').value = '';


  totalExpenses();
});
