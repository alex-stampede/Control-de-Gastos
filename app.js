document.addEventListener("DOMContentLoaded", function () {
    let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 0;
    let history = JSON.parse(localStorage.getItem('history')) || [];

    const balanceElement = document.getElementById("balance");
    const lastMovementElement = document.getElementById("last-movement");
    const conceptInput = document.getElementById("concept");
    const amountInput = document.getElementById("amount");
    const incomeBtn = document.getElementById("income-btn");
    const expenseBtn = document.getElementById("expense-btn");
    const historyList = document.getElementById("history-list");
    const clearHistoryBtn = document.getElementById("clear-history-btn");

    function updateBalance() {
        balanceElement.textContent = `$${balance.toLocaleString()}`;

        if (balance < 1000) {
            balanceElement.style.color = '#f87ca5'; // Rojo
        } else if (balance <= 3000) {
            balanceElement.style.color = '#ffeaa7'; // Amarillo
        } else {
            balanceElement.style.color = '#AA85FF'; // Verde
        }

        localStorage.setItem('balance', balance); // Guardar balance en localStorage
    }

    function addMovement(concept, amount, type) {
        const previousBalance = balance;
        if (type === "income") {
            balance += amount;
        } else if (type === "expense") {
            balance -= amount;
        }
        updateBalance();

        const movement = {
            concept: concept,
            amount: amount,
            type: type,
            date: new Date().toLocaleString(),
            previousBalance: previousBalance
        };
        history.push(movement);
        localStorage.setItem('history', JSON.stringify(history)); // Guardar historial en localStorage

        const historyCard = document.createElement("div");
        historyCard.classList.add("history-card");

        historyCard.innerHTML = `
            <div class="concept">${concept}</div>
            <div class="date">${movement.date}</div>
            <div class="amount ${type}">$${amount.toLocaleString()}</div>
            <div class="previous-balance">Balance anterior: $${previousBalance.toLocaleString()}</div>
            <button class="delete-btn">Borrar</button>
        `;

        historyCard.querySelector(".delete-btn").addEventListener("click", () => {
            if (type === "income") {
                balance -= amount;
            } else if (type === "expense") {
                balance += amount;
            }
            updateBalance();
            historyCard.remove();

            // Eliminar el movimiento del historial en localStorage
            history = history.filter(m => m.date !== movement.date || m.amount !== movement.amount || m.concept !== movement.concept || m.type !== movement.type);
            localStorage.setItem('history', JSON.stringify(history));
        });

        historyList.prepend(historyCard);

        lastMovementElement.textContent = `Último movimiento: ${type === "income" ? "+" : "-"}$${amount.toLocaleString()}`;
    }

    incomeBtn.addEventListener("click", () => {
        const concept = conceptInput.value;
        const amount = parseFloat(amountInput.value);
        if (concept && !isNaN(amount) && amount > 0) {
            addMovement(concept, amount, "income");
            conceptInput.value = '';
            amountInput.value = '';
        }
    });

    expenseBtn.addEventListener("click", () => {
        const concept = conceptInput.value;
        const amount = parseFloat(amountInput.value);
        if (concept && !isNaN(amount) && amount > 0) {
            addMovement(concept, amount, "expense");
            conceptInput.value = '';
            amountInput.value = '';
        }
    });

    // Cargar historial desde localStorage al iniciar
    function loadHistory() {
        history.forEach(movement => {
            const historyCard = document.createElement("div");
            historyCard.classList.add("history-card");

            historyCard.innerHTML = `
                <div class="concept">${movement.concept}</div>
                <div class="date">${movement.date}</div>
                <div class="amount ${movement.type}">$${movement.amount.toLocaleString()}</div>
                <div class="previous-balance">Balance anterior: $${movement.previousBalance.toLocaleString()}</div>
                <button class="delete-btn">Borrar</button>
            `;

            historyCard.querySelector(".delete-btn").addEventListener("click", () => {
                if (movement.type === "income") {
                    balance -= movement.amount;
                } else if (movement.type === "expense") {
                    balance += movement.amount;
                }
                updateBalance();
                historyCard.remove();

                // Eliminar el movimiento del historial en localStorage
                history = history.filter(m => m.date !== movement.date || m.amount !== movement.amount || m.concept !== movement.concept || m.type !== movement.type);
                localStorage.setItem('history', JSON.stringify(history));
            });

            historyList.prepend(historyCard);
        });
    }

    function clearHistory() {
        if (confirm("¿Estás seguro de que deseas borrar todo el historial y el balance?")) {
            balance = 0;
            history = [];
            localStorage.removeItem('balance'); // Borrar balance en localStorage
            localStorage.removeItem('history'); // Borrar historial en localStorage
            historyList.innerHTML = ''; // Limpiar la lista de historial en la interfaz
            updateBalance(); // Actualizar el balance
        }
    }

    clearHistoryBtn.addEventListener("click", clearHistory);

    loadHistory();
    updateBalance();
});
