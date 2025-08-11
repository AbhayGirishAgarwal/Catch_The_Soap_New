const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const starsDisplay = document.getElementById("stars");
const soapImg = document.getElementById("soapImage");
const catchSound = document.getElementById("catchSound");
const bgMusic = document.getElementById("bgMusic"); // ✅ background track

let score = 0;
let timeLeft = 30;
let soaps = [];
let gameInterval;
let timerInterval;

class Soap {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = 50;
  }

  draw() {
    ctx.drawImage(soapImg, this.x, this.y, this.size, this.size);
  }

  update() {
    this.y += this.speed;
  }
}

function spawnSoap() {
  const x = Math.random() * (canvas.width - 50);
  const speed = 2 + Math.random() * 3;
  soaps.push(new Soap(x, 0, speed));
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  soaps.forEach((soap, index) => {
    soap.update();
    soap.draw();

    if (soap.y > canvas.height) {
      soaps.splice(index, 1); // Remove if it goes off screen
    }
  });
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  soaps.forEach((soap, index) => {
    if (
      clickX >= soap.x &&
      clickX <= soap.x + soap.size &&
      clickY >= soap.y &&
      clickY <= soap.y + soap.size
    ) {
      soaps.splice(index, 1);
      score++;
      scoreDisplay.textContent = score;

      // ✅ Play Bubble Pop sound from start
      catchSound.currentTime = 0;
      catchSound.play().catch(() => {});
    }
  });
});

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameOverScreen.classList.remove("hidden");
  finalScore.textContent = score;

  // ✅ stop background music
  bgMusic.pause();
  bgMusic.currentTime = 0;

  if (score >= 15) {
    starsDisplay.textContent = "⭐⭐⭐";
  } else if (score >= 8) {
    starsDisplay.textContent = "⭐⭐";
  } else {
    starsDisplay.textContent = "⭐";
  }
}

function startGame() {
  score = 0;
  timeLeft = 30;
  soaps = [];
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  gameOverScreen.classList.add("hidden");

  // ✅ Unlock click sound
  catchSound.play().then(() => {
    catchSound.pause();
    catchSound.currentTime = 0;
  }).catch(() => {});

  // ✅ Start background music
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});

  gameInterval = setInterval(() => {
    updateGame();
    if (Math.random() < 0.1) {
      spawnSoap();
    }
  }, 30);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

restartBtn.addEventListener("click", startGame);
window.onload = startGame;
