const nav = document.querySelector("nav#links");
const botao = document.querySelector("button#boto");

botao.addEventListener("click", () => {
  nav.classList.toggle("arise");
});