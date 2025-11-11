// Fina App — Controle Financeiro Funcional

// Seletores
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionsList = document.getElementById('transactions');
const clearBtn = document.getElementById('clear');

// Recupera transações do localStorage
let transactions = JSON.parse(localStorage.getItem('fina_transactions')) || [];

// Função para atualizar a interface
function updateUI() {
  transactionsList.innerHTML = '';
  let balance = 0;
  let income = 0;
  let expenses = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement('li');
    li.className = t.amount > 0 ? 'income' : 'expense';
    li.innerHTML = `
      <span>${t.description}</span>
      <span>${t.amount > 0 ? '+' : ''}R$ ${t.amount.toFixed(2)}</span>
      <button class="delete-btn" data-index="${index}">✖</button>
    `;
    transactionsList.appendChild(li);

    if (t.amount > 0) income += t.amount;
    else expenses += t.amount;

    balance += t.amount;
  });

  balanceEl.textContent = `R$ ${balance.toFixed(2)}`;
  incomeEl.textContent = `R$ ${income.toFixed(2)}`;
  expensesEl.textContent = `R$ ${Math.abs(expenses).toFixed(2)}`;

  localStorage.setItem('fina_transactions', JSON.stringify(transactions));
}

// Adiciona transação
form.addEventListener('submit', e => {
  e.preventDefault();
  let description = descriptionInput.value.trim();
  let amountStr = amountInput.value.trim();

  // Aceitar vírgula ou ponto
  amountStr = amountStr.replace(',', '.');
  const amount = parseFloat(amountStr);

  if (!description || isNaN(amount)) {
    alert('Preencha todos os campos corretamente! Ex: 80,53 ou -25,75');
    return;
  }

  transactions.unshift({ description, amount });
  form.reset();
  updateUI();
});

// Deletar transação individual
transactionsList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    transactions.splice(index, 1);
    updateUI();
  }
});

// Limpar histórico
clearBtn.addEventListener('click', () => {
  if (confirm('Deseja realmente limpar todo o histórico?')) {
    transactions = [];
    updateUI();
  }
});

// Inicializa
updateUI();


