let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 0;
let history = JSON.parse(localStorage.getItem('history')) || [];

const balanceInput = document.getElementById('balance');
const historyList = document.getElementById('history-list');

function formatCurrency(amount) {
    return '$' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateBalanceDisplay() {
    balanceInput.value = formatCurrency(balance);
    if (balance < 1000) {
        balanceInput.style.color = '#f44336';
    } else if (balance >= 1001 && balance <= 3000) {
        balanceInput.style.color = '#ffeb3b';
    } else {
        balanceInput.style.color = '#4caf50';
    }
}

function updateHistory() {
    historyList.innerHTML = '';
    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('history-item');
        li.innerHTML = `
            <span class="history-column concept">${item.concept}</span>
            <span class="history-column ${item.type}">${formatCurrency(item.amount)}</span>
            <span class="history-column"><button onclick="deleteTransaction(${index})">Borrar</button></span>
        `;
        historyList.appendChild(li);
    });
}

function updateBalance(amount, type) {
    if (type === 'income') {
        balance += amount;
    } else {
        balance -= amount;
    }
    updateBalanceDisplay();
    localStorage.setItem('balance', balance);
}

function addTransaction(type) {
    const concept = document.getElementById('concept').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (concept && !isNaN(amount) && amount > 0) {
        history.push({ type, concept, amount });
        updateBalance(amount, type);
        updateHistory();
        localStorage.setItem('history', JSON.stringify(history));
        document.getElementById('concept').value = '';
        document.getElementById('amount').value = '';
    }
}

function deleteTransaction(index) {
    const removed = history.splice(index, 1)[0];
    updateBalance(-removed.amount, removed.type);
    updateHistory();
    localStorage.setItem('history', JSON.stringify(history));
}

document.getElementById('income-btn').addEventListener('click', () => addTransaction('income'));
document.getElementById('expense-btn').addEventListener('click', () => addTransaction('expense'));

updateBalanceDisplay();
updateHistory();
