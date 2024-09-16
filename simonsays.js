
let gameSequence = [];
let playerSequence = [];
let colors = ['green', 'red', 'yellow', 'blue'];
let gameActive = false;
let sequenceIndex = 0;
let actionTimeout;
let signalInterval = 600;
let highestScore = 0;  // Track the highest score
let currentScore = 0;  // Track the player's current game score

function flashColor(color) {
  const colorButton = document.getElementById(color + 'circle');
  const originalBackground = colorButton.style.backgroundColor;
  colorButton.style.backgroundColor = 'white';
  setTimeout(() => {
    colorButton.style.backgroundColor = originalBackground;
  }, 300);
}

function startGame() {
  gameSequence = [];
  playerSequence = [];
  sequenceIndex = 0;
  currentScore = 0;  // Reset the current score when the game starts
  updateScoreDisplay();  // Reset score display to "00"
  gameActive = false;

  const statusIndicator = document.getElementById('status-indicator');
  statusIndicator.style.backgroundColor = 'green';

  setTimeout(() => {
    gameActive = true;
    addColorToSequence();
  }, 3000);
}

function addColorToSequence() {
  playerSequence = [];
  sequenceIndex = 0;
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gameSequence.push(randomColor);
  playSequence();
}

function playSequence() {
  gameActive = false;
  let i = 0;
  const interval = setInterval(() => {
    flashColor(gameSequence[i]);
    i++;
    if (i >= gameSequence.length) {
      clearInterval(interval);
      gameActive = true;
      setActionTimeout();
    }
  }, signalInterval);
}

function validateSequence() {
  clearTimeout(actionTimeout);

  if (playerSequence[sequenceIndex] === gameSequence[sequenceIndex]) {
    sequenceIndex++;

    if (sequenceIndex === gameSequence.length) {
      // Player successfully completed the full sequence
      currentScore++;  // Increment the current score (number of sequences completed)
      updateScoreDisplay();  // Update the right button to reflect the score

      // Check if we need to increase the speed
      if (currentScore % 4 === 0 && signalInterval > 200) {
        increaseSpeed();  // Increase speed after every 4 sequences
      }

      setTimeout(addColorToSequence, 1000);  // Add a new color to the sequence
    } else {
      // Still waiting for the player to complete the current sequence
      setActionTimeout();
    }
  } else {
    // Player made a mistake, end the game
    alert('Game Over! Wrong sequence.');
    flashAllButtons();
    endGame();
  }
}

function increaseSpeed() {
  signalInterval -= 100;  // Reduce the interval to increase game speed
}

function setActionTimeout() {
  actionTimeout = setTimeout(() => {
    alert('Too slow! Game Over.');
    flashAllButtons();
    endGame();
  }, 5000);  // 5-second limit for player response
}

function endGame() {
  const statusIndicator = document.getElementById('status-indicator');
  statusIndicator.style.backgroundColor = 'red';
  
  // Update the highest score if necessary
  if (currentScore > highestScore) {
    highestScore = currentScore;
  }

  updateScoreDisplay();  // Update the left button with the highest score
  gameActive = false;
}

function flashAllButtons() {
  const flashes = 5;
  let count = 0;
  const interval = setInterval(() => {
    colors.forEach(color => {
      const button = document.getElementById(color + 'circle');
      button.style.backgroundColor = 'white';
    });

    setTimeout(() => {
      colors.forEach(color => {
        const button = document.getElementById(color + 'circle');
        button.style.backgroundColor = color;
      });
    }, 250);

    count++;
    if (count === flashes) clearInterval(interval);
  }, 500);
}

// Function to update the score display
function updateScoreDisplay() {
  // Update highest score on the left button (always two digits)
  document.getElementById('left-button').innerText = highestScore.toString().padStart(2, '0');
  
  // Update current score on the right button (always two digits)
  document.getElementById('right-button').innerText = currentScore.toString().padStart(2, '0');
}

/* Set up event listeners */
document.getElementById('start-button').addEventListener('click', startGame);

colors.forEach(color => {
  document.getElementById(color + 'circle').addEventListener('click', function () {
    if (gameActive) {
      playerSequence.push(color);
      validateSequence();
    }
  });
});
