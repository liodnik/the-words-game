const urlParams = new URLSearchParams(window.location.search);
const level = parseInt(urlParams.get("winLevel"));

document.getElementById("finished-level").innerText = `Уровень ${level} пройден`;
document.getElementById("next-level").innerText = `Уровень ${level + 1}`;
document.getElementById("win-button").addEventListener("click", () => {
  window.location.href = `index.html?level=${level + 1}`;
});
