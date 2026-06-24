const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const suggestionForm = document.getElementById("suggestionForm");
const formMessage = document.getElementById("formMessage");
const pollButtons = document.querySelectorAll(".poll-option");
const pollResult = document.getElementById("pollResult");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeIcon.textContent = "☀️";
  }
});

suggestionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const turma = document.getElementById("turma").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const sugestao = document.getElementById("sugestao").value.trim();

  if (!nome || !turma || !categoria || !sugestao) {
    formMessage.style.color = "#ef4444";
    formMessage.textContent = "Preencha todos os campos antes de enviar.";
    return;
  }

  formMessage.style.color = "#16a34a";
  formMessage.textContent = `Obrigado, ${nome}! Sua sugestão foi registrada com sucesso.`;
  suggestionForm.reset();
});

pollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const option = button.dataset.poll;
    pollResult.textContent = `Você votou em: ${option}. Obrigado por participar!`;
    pollResult.style.color = "#16a34a";
  });
});