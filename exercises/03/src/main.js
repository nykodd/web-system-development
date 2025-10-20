let expenses = [];

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Budget Tracker</h1>
    <input type="text" name="expense-name" id="expense-name" placeholder="Expense name">
    <input type="text" name="expense-amount" id="expense-amount" placeholder="Amount">
    <button id="add-expense">Add Expense</button>
    <ul id="expense-list"></ul>
    <p>Total: <span id="total">0</span></p>
  </div>
`

// validate input
function validateInput(name, amount) {
  if (!name || name.trim() === "") { // if name exists and is not empty
    alert("Expense name must not be empty!");
    return false;
  }
  
  // replace comma with dot for decimal separator
  const normalizedAmount = amount.replace(',', '.');
  const amountNum = parseFloat(normalizedAmount); // convert to number
  
  if (isNaN(amountNum) || amountNum <= 0) { // if amount is not a number or is less than 0
    alert("Amount must be a positive number!");
    return false;
  }
  
  return true;
}

// calculate and update total
function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  document.querySelector('#total').textContent = total.toFixed(2);
}

// render the expense list
function renderExpenses() {
  const expenseList = document.querySelector('#expense-list');
  expenseList.innerHTML = expenses.map(expense => 
    `<li>${expense.name} - ${expense.amount}</li>`
  ).join(''); // append to the list
}

// handle button click
document.querySelector('#add-expense').addEventListener('click', () => {
  const nameInput = document.querySelector('#expense-name');
  const amountInput = document.querySelector('#expense-amount');
  
  const expenseName = nameInput.value;
  const expenseAmount = amountInput.value;
  
  if (!validateInput(expenseName, expenseAmount)) { 
    return;
  }

  const normalizedAmount = expenseAmount.replace(',', '.');
    
  // add expense to list
  expenses.push({
    name: expenseName.trim(),
    amount: parseFloat(normalizedAmount)
  });
  
  // clear inputs after each addition :)
  nameInput.value = '';
  amountInput.value = '';
  
  renderExpenses();
  updateTotal();
});
