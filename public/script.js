// * Elements *

// containers
const startContainer = document.getElementById("startContainer");
const gameContainer = document.getElementById("gameContainer");
const gameOverContainer = document.getElementById("gameOverContainer");

// game related elements
const wordPrompt = document.getElementById("wordPrompt");
const inputWord = document.getElementById("inputWord");
const gameTimeEl = document.getElementById("gameTime");

// variables
let inputtedWords = [];
let syllableList = [];
let wordsList = [];
let promptTime;
let promptTimeInterval;

// Lives
const life2 = document.getElementById("lifeTwo");
const life3 = document.getElementById("lifeThree");
let life;

// score elements
const finalScoreEl = document.getElementById("finalScore");
const scoreEl = document.getElementById("score");
let score = 0;

// save the highest scores in localStorage
const highscoresEl = document.getElementById("highscores");
let highscores = localStorage.getItem("highscores") || Array(5).fill(0);
if (typeof highscores == "string") highscores = highscores.split(";");

// * Game functions *
// Switch from the home page to the game page and start
function startGame() {
  inputWord.focus();
  life = 3;
  lifeCount();
  nextPrompt();

  startContainer.style.display = "none";
  gameContainer.style.display = "block";
};

// Set the time to a random number between 4 and 8
function setPromptTime() {
  const min = 4;
  const max = 8;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  promptTime = randomNumber;
  console.log(promptTime);
};

// Check if the score will increase or decrease and update accordingly
function updateScore(plus) {
  if (plus) {
    score++;
  } else {
    life--;
    lifeCount();
  }

  scoreEl.innerText = score;
};

// Check how many lives have left and change it in the HTML
function lifeCount() {
  if (life === 3) {
    life3.classList.remove('bi-heart');
    life3.classList.add('bi-heart-fill');
    
    life2.classList.remove('bi-heart');
    life2.classList.add('bi-heart-fill');
  } 
  else if (life === 2) {
    life3.classList.remove('bi-heart-fill');
    life3.classList.add('bi-heart');
  } 
  else if (life === 1) {
    life2.classList.remove('bi-heart-fill');
    life2.classList.add('bi-heart');
  } 
  else {
    endGame();
  }
};

// Change to the next syllable
function nextPrompt() {
  wordPrompt.innerText = getRandomSyllable();
  inputWord.value = "";

  setPromptTime();
  let currentPromptTime = promptTime;

  clearInterval(promptTimeInterval);
  promptTimeInterval = setInterval(() => {
    currentPromptTime--;
    if (currentPromptTime !== 0) {
      console.log(currentPromptTime);
    } else {
      nextPrompt();
      updateScore(false);
    };
  }, 1000);
};

// Receives the typed word and checks if it is correct
function sendWord() {
  const word = inputWord.value.toLowerCase();

  if(!inputtedWords.includes(word) &&
    word.includes(wordPrompt.innerText) &&
    wordExists(word)
  ) {updateScore(true);
    inputtedWords.push(word);
    nextPrompt();
  } else {inputWord.value = ""};
};


// generates syllables from JSON words
function generateSyllables(words) {
  const syllableSet = new Set();

  for (const word of words) {
    for (let i = 0; i <= word.length - 3; i++) {
      const syllable = word.substring(i, i + 3);
      syllableSet.add(syllable);
    };
  };
  syllableList = [...syllableSet];
};

// Choose a random syllable
function getRandomSyllable() {
  const index = Math.floor(Math.random() * syllableList.length);
  return syllableList[index];
};

// connects to the word list
async function loadWords() {
  const response = await fetch("../words.json");
  const data = await response.json();

  wordsList = data.words;
  generateSyllables(wordsList);
};
loadWords();

// checks if the word exists in the database
function wordExists(word) {
  return wordsList.includes(word);
}

// Compile the highest scores to show
function loadHighscores() {
  // reset highscore element
  highscoresEl.innerHTML = "";

  // store highscores into localStorage
  localStorage.setItem("highscores", highscores.join(";"));

  for (const highscore of highscores) {
    const listItem = document.createElement("li");
    listItem.innerText = highscore;

    highscoresEl.appendChild(listItem);
  }
};

// Places the highest scores in the ranking
function findHighscoreIndex(score) {
  const index = highscores.findIndex(highscore => highscore < score);
  return index < 0 ? highscores.length - 1 : index;
};

// Ends the game and switches to the game over page
function endGame() {
  clearInterval(promptTimeInterval);
  
  if (score > highscores[highscores.length - 1]) {
    highscores.splice(findHighscoreIndex(score), 0, score);
    highscores.pop();

    loadHighscores();
  }
  finalScoreEl.innerText = `Pontuação final: ${score}`;

  score = 0;
  inputtedWords = [];

  gameContainer.style.display = "none";
  gameOverContainer.style.display = "block";
};

// Return to the home page
function restartGame() {
  gameOverContainer.style.display = "none";
  startContainer.style.display = "block";
};

// Send the word if hear a click on enter
inputWord.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    sendWord();
  }
});

// Click buttons
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("returnButton").addEventListener("click", restartGame);
document.getElementById("sendButton").addEventListener("click", sendWord);