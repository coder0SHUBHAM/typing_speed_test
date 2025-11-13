// Typing Speed Test — WPM, Accuracy, Mistakes, Timer
const paragraphs = [
  "Typing is a skill that improves with practice and consistency.",
  "Web technology connects ideas and people across the globe in seconds.",
  "Clean code is a developer's best friend and future investment.",
  "JavaScript adds interactivity and brings websites to life for users.",
  "Focus on accuracy first; speed will follow with steady practice."
];

const promptEl = document.getElementById("prompt");
const inputEl = document.getElementById("input");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const mistakesEl = document.getElementById("mistakes");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("result");

let chars = [];
let currentIndex = 0;
let mistakes = 0;
let startTime = null;
let totalTime = 60; // seconds
let timerId = null;

function pickParagraph() {
  const text = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  chars = text.split("");
  promptEl.innerHTML = chars
    .map((ch, i) => `<span data-idx="${i}">${ch}</span>`)
    .join("");
  highlightCurrent();
}

function highlightCurrent() {
  document.querySelectorAll(".prompt span").forEach((el) => {
    el.classList.remove("current");
  });
  const currentEl = document.querySelector(`.prompt span[data-idx="${currentIndex}"]`);
  if (currentEl) currentEl.classList.add("current");
}

function startTest() {
  resetState();
  pickParagraph();
  inputEl.disabled = false;
  inputEl.value = "";
  inputEl.focus();
  startBtn.disabled = true;
  startTime = Date.now();
  updateTime();
  timerId = setInterval(updateTime, 1000);
}

function endTest(reason = "Time up!") {
  inputEl.disabled = true;
  startBtn.disabled = false;
  clearInterval(timerId);
  const elapsedSec = Math.max(1, (Date.now() - startTime) / 1000);
  const typedChars = currentIndex;
  const grossWPM = Math.round((typedChars / 5) / (elapsedSec / 60));
  const correctChars = typedChars - mistakes;
  const accuracy = Math.max(0, Math.round((correctChars / Math.max(1, typedChars)) * 100));

  wpmEl.textContent = grossWPM;
  accuracyEl.textContent = `${accuracy}%`;
  mistakesEl.textContent = mistakes;

  resultEl.innerHTML = `
    <strong>Result:</strong> ${reason}
    • WPM: ${grossWPM}
    • Accuracy: ${accuracy}%
    • Mistakes: ${mistakes}
  `;
}

function resetState() {
  chars = [];
  currentIndex = 0;
  mistakes = 0;
  startTime = null;
  totalTime = 60;
  timeEl.textContent = `${totalTime}s`;
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  mistakesEl.textContent = "0";
  resultEl.textContent = "";
  promptEl.innerHTML = "";
  clearInterval(timerId);
}

function updateTime() {
  const remaining = totalTime - Math.floor((Date.now() - startTime) / 1000);
  timeEl.textContent = `${Math.max(0, remaining)}s`;
  if (remaining <= 0) endTest("Time up!");
}

inputEl.addEventListener("input", (e) => {
  if (!chars.length) return;
  const val = e.target.value;
  const lastChar = val[val.length - 1];

  const expected = chars[currentIndex];

  // Backspace handling
  if (e.inputType === "deleteContentBackward") {
    if (currentIndex > 0) {
      currentIndex--;
      const el = document.querySelector(`.prompt span[data-idx="${currentIndex}"]`);
      el.classList.remove("correct", "wrong");
      highlightCurrent();
    }
    return;
  }

  if (lastChar === expected) {
    const el = document.querySelector(`.prompt span[data-idx="${currentIndex}"]`);
    el.classList.add("correct");
    currentIndex++;
  } else {
    const el = document.querySelector(`.prompt span[data-idx="${currentIndex}"]`);
    el.classList.add("wrong");
    mistakes++;
    // allow progress only on correct char; user must fix or skip
  }

  highlightCurrent();

  // Live WPM & Accuracy updates
  const elapsedSec = Math.max(1, (Date.now() - startTime) / 1000);
  const typedChars = currentIndex;
  const grossWPM = Math.round((typedChars / 5) / (elapsedSec / 60));
  const correctChars = typedChars - mistakes;
  const accuracy = Math.max(0, Math.round((correctChars / Math.max(1, typedChars)) * 100));

  wpmEl.textContent = grossWPM;
  accuracyEl.textContent = `${accuracy}%`;
  mistakesEl.textContent = mistakes;

  if (currentIndex >= chars.length) {
    endTest("Completed!");
  }
});

startBtn.addEventListener("click", startTest);
resetBtn.addEventListener("click", () => {
  resetState();
  inputEl.disabled = true;
  startBtn.disabled = false;
});
