let playerName = "You";
let isWalking = false;
let frameToggle = false;

const kitty = document.getElementById("kitty");
const cakesContainer = document.getElementById("cakes-container");
const counter = document.getElementById("counter");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupText = document.getElementById("popup-text");
const walkSound = document.getElementById("walkSound");
const eatSound = document.getElementById("eatSound");
const popupSound = document.getElementById("popupSound");

let cakeCount = 0;
let cakes = [];

function startGame() {
  const nameInput = document.getElementById("player-name-input").value.trim();
  if (nameInput) {
    playerName = nameInput;
  }

  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  createCakes();
  createClouds();
  counter.textContent = `Cakes: 0`;
}

function animateKitty() {
  kitty.src = frameToggle ? "kitty_walk.png" : "kitty_stand.png";
  frameToggle = !frameToggle;
  clearTimeout(walkTimeout);
  walkTimeout = setTimeout(() => {
    kitty.src = "kitty_stand.png";
  }, 300);
}

let walkTimeout;

function createCakes() {
  for (let i = 0; i < 15; i++) {
    const cake = document.createElement("img");
    cake.src = "cake.png";
    cake.classList.add("cake");
    cake.style.top = Math.random() * 90 + "%";
    cake.style.left = Math.random() * 90 + "%";
    cakesContainer.appendChild(cake);
    cakes.push(cake);
  }
}

function checkCollision() {
  const kittyBox = kitty.getBoundingClientRect();

  for (let i = cakes.length - 1; i >= 0; i--) {
    const cake = cakes[i];
    const cakeBox = cake.getBoundingClientRect();

    if (
      kittyBox.left < cakeBox.right &&
      kittyBox.right > cakeBox.left &&
      kittyBox.top < cakeBox.bottom &&
      kittyBox.bottom > cakeBox.top
    ) {
      cake.remove();
      cakes.splice(i, 1);
      cakeCount++;
      counter.textContent = `Cakes: ${cakeCount}`;

      eatSound.currentTime = 0;
      eatSound.play();

      if (cakeCount === 15) {
        celebrate();
      }
    }
  }
}

function celebrate() {
  popupSound.currentTime = 0;
  popupSound.play();
  popup.classList.remove("hidden");
  popupTitle.textContent = `🎉🎂 Happy Birthday, ${playerName}! 🎂🎉`;
  popupText.textContent = `You helped Hello Kitty eat all the cakes, ${playerName}!`;

  confetti({
    particleCount: 300,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function resetGame() {
  window.location.reload();
}

function createClouds() {
  const cloudsContainer = document.getElementById("clouds-container");
  const cloudCount = 5;

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");
    cloud.style.top = Math.random() * 80 + "px";
    cloud.style.animationDuration = (30 + Math.random() * 30) + "s";
    cloud.style.animationDelay = (i * 6) + "s";
    cloudsContainer.appendChild(cloud);
  }
}

window.addEventListener("keydown", function(e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
});

document.addEventListener("keydown", (e) => {
  if (document.getElementById("game-container").classList.contains("hidden")) return;

  const step = 10;
  let moved = false;
  let x = kitty.offsetLeft;
  let y = kitty.offsetTop;

  const container = document.getElementById("game-container");
  const maxX = container.clientWidth - kitty.clientWidth;
  const maxY = container.clientHeight - kitty.clientHeight;

  if (e.key === "ArrowLeft") {
    x -= step;
    moved = true;
  }
  if (e.key === "ArrowRight") {
    x += step;
    moved = true;
  }
  if (e.key === "ArrowUp") {
    y -= step;
    moved = true;
  }
  if (e.key === "ArrowDown") {
    y += step;
    moved = true;
  }

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  if (moved) {
    animateKitty();
    kitty.style.left = `${x}px`;
    kitty.style.top = `${y}px`;
    walkSound.currentTime = 0;
    walkSound.play();
    checkCollision();
  }
});
