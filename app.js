const gameBoard = document.querySelector('#board');
const info = document.querySelector('#info');
let turn;
const winningCombos = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top left to bottom right
  [2, 4, 6] // diagonal top right to bottom left
];

// Create the gameboard
function createGameBoard() {
  const emptyTiles = Array(9).fill('');
  const tileGrid = emptyTiles
    .map((t) => `<button class="tile"></button>`)
    .join("");
  gameBoard.innerHTML = tileGrid;
  turn = "X";
  document.documentElement.style.setProperty("--hue", 10);
  info.textContent = `${turn}’s turn`;
  gameBoard.addEventListener("click", handleGameBoardClick);
  const allTiles = gameBoard.querySelectorAll('.tile');
  allTiles.forEach((tile) => {
    tile.addEventListener('mouseenter', handleMouseEnter);
    tile.addEventListener('mouseleave', handleMouseLeave);
  });
  gameBoard.removeAttribute('inert'); // enable keyboard focus
}
createGameBoard();

// Update the turn
function updateTurn() {
  turn = turn === 'X' ? 'O' : 'X';
  info.textContent = `It's ${turn}'s turn`;
  document.documentElement.style.setProperty('--hue', turn === 'X' ? 10 : 200);
}

// Restart the game
function restartGame() {
  let seconds = 3;
  const timer = setInterval(() => {
    info.textContent = `Restarting in ${seconds} seconds`;
    seconds--;
    if (seconds < 0) {
      // Clear the interval
      clearInterval(timer);

      // Restart the game
      createGameBoard();
    }
  }, 1000);
}


// Show the congrats
function showCongrats() {
  info.textContent = `${turn} wins!`;
  gameBoard.removeEventListener('click', handleGameBoardClick);
  gameBoard.setAttribute('inert', true); // disable keyboard focus
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: ['🎉', '🥳', '👏', '✨'],
  });
  setTimeout(restartGame, 300);
}

// Check the score
function checkScore() {
  const allTiles = [...document.querySelectorAll(".tile")];
  const tileValues = allTiles.map((tile) => {
    return tile.dataset.value
  });
  const isWinner = winningCombos.some((combo) => {
    const [a, b, c] = combo;
    return (
      tileValues[a] &&
      tileValues[a] === tileValues[b] &&
      tileValues[a] === tileValues[c]
    );
  });
  if (isWinner) {
    return showCongrats();
  }
  updateTurn();
}

// Handle the gameboard click
function handleGameBoardClick(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.value = turn;
    e.target.style.setProperty("--hue", turn === "X" ? 10 : 200);
    checkScore();
  }
}

// Handle mouse enter (hover)
function handleMouseEnter(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.hover = turn;
    e.target.style.setProperty("--hue", turn === "X" ? 10 : 200);
  }
}

// Handle mouse leave (hover)
function handleMouseLeave(e) {
  e.target.dataset.hover = '';
}