
// Containers
const startContainer = document.getElementById("startContainer");
const gameContainer = document.getElementById("gameContainer");
const gameOverContainer = document.getElementById("gameOverContainer");


function startGame() {
  startContainer.style.display = "none";
  gameContainer.style.display = "block";
};

function skipGame() {
  gameContainer.style.display = "none";
  gameOverContainer.style.display = "block";
};

function restartGame() {
    gameOverContainer.style.display = "none";
    startContainer.style.display = "block";
};

// Click buttons
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("skipButton").addEventListener("click", skipGame);
document.getElementById("returnButton").addEventListener("click", restartGame);