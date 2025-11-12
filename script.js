// Simple Tic Tac Toe (two-player local)
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const turnEl = document.getElementById('turn');
const restartBtn = document.getElementById('restart');
const cells = Array.from(document.querySelectorAll('.cell'));

let boardState; // array of 'X'|'O'|null
let currentPlayer;
let running;

const WINNING_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];

function startGame(){
  boardState = Array(9).fill(null);
  currentPlayer = 'X';
  running = true;
  cells.forEach(c => {
    c.textContent = '';
    c.classList.remove('x','o');
    c.disabled = false;
  });
  updateStatus();
}

function updateStatus(message){
  if(message){
    statusEl.textContent = message;
  } else {
    statusEl.innerHTML = `Turn: <span id="turn">${currentPlayer}</span>`;
    // update turn color via class on cells (not necessary but keep element)
  }
}

function handleCellClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(!running || boardState[idx]) return;

  makeMove(idx, currentPlayer);
  render();

  const won = checkWin(currentPlayer);
  if(won){
    running = false;
    highlightWinning(won);
    updateStatus(`Player ${currentPlayer} wins!`);
    return;
  }

  if(checkDraw()){
    running = false;
    updateStatus("It's a draw.");
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
}

function makeMove(index, player){
  boardState[index] = player;
}

function render(){
  boardState.forEach((val, idx) => {
    const el = cells[idx];
    el.textContent = val ? val : '';
    el.classList.toggle('x', val === 'X');
    el.classList.toggle('o', val === 'O');
    if(val) el.disabled = true;
  });
}

function checkWin(player){
  for(const combo of WINNING_COMBINATIONS){
    const [a,b,c] = combo;
    if(boardState[a] === player && boardState[b] === player && boardState[c] === player){
      return combo; // return winning combo
    }
  }
  return null;
}

function highlightWinning(combo){
  combo.forEach(i => {
    cells[i].style.boxShadow = `0 6px 20px rgba(6,182,212,0.12)`;
    cells[i].style.transform = 'scale(1.03)';
  });
}

function checkDraw(){
  return boardState.every(cell => cell !== null);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', () => {
  // clear any highlights
  cells.forEach(c => {
    c.style.boxShadow = '';
    c.style.transform = '';
  });
  startGame();
});

// keyboard support: allow number keys 1-9 to play cells
document.addEventListener('keydown', (e) => {
  if(!running) return;
  const key = e.key;
  if(key >= '1' && key <= '9'){
    const idx = Number(key) - 1;
    cells[idx].click();
  }
});

startGame();
