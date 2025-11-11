// Alterna entre Login e Cadastro
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");

// Mostrar formulário de cadastro
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

// Mostrar formulário de login
showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Simulação de login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (email && password) {
    // Aqui você poderia validar com backend ou localStorage
    alert("Login realizado com sucesso!");
    window.location.href = "fina.html"; // Redireciona para o app principal
  } else {
    alert("Preencha todos os campos!");
  }
});

// Simulação de cadastro
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (name && email && password) {
    alert("Conta criada com sucesso!");
    window.location.href = "fina.html"; // Vai para o app principal
  } else {
    alert("Preencha todos os campos!");
  }
});