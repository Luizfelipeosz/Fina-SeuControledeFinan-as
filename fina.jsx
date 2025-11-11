import React, { useState } from "react";
import "./fina.css";

function FinaApp() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Calcula valores
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expenses;

  // Adicionar transação
  const handleAdd = (e) => {
    e.preventDefault();
    if (!description || isNaN(amount)) return alert("Preencha os campos corretamente!");

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription("");
    setAmount("");
  };

  // Limpar histórico
  const clearHistory = () => {
    if (window.confirm("Tem certeza que deseja limpar o histórico?")) {
      setTransactions([]);
    }
  };

  // Navegação simples
  const handleLogout = () => (window.location.href = "fina-login.html");
  const goToReports = () => (window.location.href = "MeuRelatorio.html");
  const goToContacts = () => (window.location.href = "contatos.html");

  return (
    <div>
      <header>
        <div className="header-content">
          <h1>💰 Fina</h1>

          <div className="header-buttons">
            <button onClick={goToContacts}>Contatos</button>
            <button onClick={goToReports}>Relatórios</button>
          </div>

          <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
        <p>Seu controle financeiro simples e rápido</p>
      </header>

      <main className="container">
        {/* Saldo */}
        <section className="balance-section">
          <h2>Saldo atual</h2>
          <div id="balance">
            {balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </section>

        {/* Formulário */}
        <section className="form-section">
          <h2>Adicionar Transação</h2>
          <form onSubmit={handleAdd}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição"
              required
            />
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor (use negativo para saída)"
              required
            />
            <button type="submit">Adicionar</button>
          </form>
        </section>

        {/* Resumo */}
        <section className="summary-section">
          <div>
            <h3>Entradas</h3>
            <div>
              {income.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
          <div>
            <h3>Saídas</h3>
            <div>
              {Math.abs(expenses).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
        </section>

        {/* Histórico */}
        <section className="list-section">
          <h2>Histórico</h2>
          <ul id="transactions">
            {transactions.length === 0 ? (
              <li>Nenhuma transação registrada</li>
            ) : (
              transactions.map((t) => (
                <li key={t.id} className={t.amount < 0 ? "negative" : "positive"}>
                  {t.description} —{" "}
                  {t.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </li>
              ))
            )}
          </ul>
          <button onClick={clearHistory}>Limpar histórico</button>
        </section>
      </main>

      <footer>© 2025 Fina - Luiz Felipe</footer>
    </div>
  );
}

export default FinaApp;