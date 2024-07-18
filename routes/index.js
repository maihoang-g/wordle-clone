'use strict';

const { play,
  Constants: { WORD_SIZE, MAX_ATTEMPTS },
  Matches: { EXACT_MATCH, PARTIAL_MATCH },
  GameStatus: { WIN, IN_PROGRESS, LOSS } } = require('../routes/wordle.js');

let nextLetter;
let currentAttempt;
let currentGuess;
let targetWord;

document.addEventListener('DOMContentLoaded', function() {
  setUpNewGame();
});

document.addEventListener('keyup', function(event) {
  event.preventDefault();
  const pressedKey = String(event.key);


  if (pressedKey === 'Backspace') {
    removeLetter();
    return;
  }

  if (pressedKey === 'Enter' && nextLetter === WORD_SIZE) {
    submitGuess();
    return;
  }

  if (pressedKey === 'Enter' && nextLetter === -1){
    setUpNewGame();
    return;
  }

  const isLetter = pressedKey.match(/[a-z]/gi);
  if (isLetter && 
      isLetter.length === 1 &&
      nextLetter < WORD_SIZE &&
      nextLetter !== -1 &&
      currentAttempt < MAX_ATTEMPTS) {

    insertLetter(pressedKey);
  }

  disableButton('submit-btn', (currentGuess.length !== WORD_SIZE));
});


async function setUpNewGame() {
  nextLetter = 0;
  currentAttempt = 0;
  currentGuess = '';
  const newWord = await fetch('/randomword').then(res => res.json());
  targetWord = newWord.word; 

  // targetWord = 'FAVOR'; //remove this one and uncomment top one

  const grid = document.querySelector('.grid');
  
  grid.innerHTML = '';
  showMessage('');

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const row  = document.createElement('div');
    row.className = 'letter-row';
    for (let j = 0; j < WORD_SIZE; j++) {
      const cell = document.createElement('div');
      cell.className = 'letter-cell';

      row.appendChild(cell);
    }

    grid.appendChild(row);
  }

  disableButton('play-again-btn', true);
  disableButton('submit-btn', true);
  document.getElementsByClassName('submit-btn')[0].style.display = 'inline'; 
  document.getElementsByClassName('play-again-btn')[0].style.display = 'none';
}

function disableButton(className, isDisabled) {
  document.getElementsByClassName(className)[0].disabled = isDisabled;
}

async function submitGuess() {
   
  const data = await fetch(`/spellcheck/${currentGuess}`).then(res => res.json());
  
  if(!data.isSpellingCorrect) {
    showMessage('Not a word, please try a new word before submitting again');

    disableButton('submit-btn', true);
    
    return;
  }

  const response = play(currentAttempt, targetWord, currentGuess);

  checkGameStatus(response.gameStatus);

  updateRowColors(response.wordResponse);

  showMessage(response.message);

  disableButton('submit-btn', true);

  currentAttempt = response.attempts;
  nextLetter = response.gameStatus === IN_PROGRESS ? 0 : -1;
  currentGuess = '';
}

function insertLetter(pressedKey) {
  pressedKey = pressedKey.toUpperCase();

  const row = document.getElementsByClassName('letter-row')[currentAttempt];
  const cell = row.children[nextLetter];
  cell.textContent = pressedKey;
  currentGuess += pressedKey;
  cell.classList.add('filled-cell');

  nextLetter += 1;
}

function removeLetter() {
  if (nextLetter !== 0) {
    const row = document.getElementsByClassName('letter-row')[currentAttempt];
    const cell = row.children[nextLetter - 1];
    cell.textContent = '';
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    cell.classList.remove('filled-cell');
    nextLetter -= 1;
  }
}

function updateRowColors(wordResponse) {
  const row = document.getElementsByClassName('letter-row')[currentAttempt];
  
  wordResponse.map( (letterStatus, position) => {
    const cell = row.children[position];

    if (letterStatus === EXACT_MATCH) {
      cell.classList.add('correct');
      return;
    }

    if (letterStatus === PARTIAL_MATCH) {
      cell.classList.add('partial');
      return;
    }

    cell.classList.add('incorrect');
  });
}

function showMessage(message) {
  const messageDiv = document.getElementById('game-message');

  messageDiv.textContent = message;
}

function checkGameStatus(gameStatus) {
  if (gameStatus === WIN || gameStatus === LOSS){
    document.getElementsByClassName('submit-btn')[0].style.display = 'none'; 
    document.getElementsByClassName('play-again-btn')[0].style.display = 'inline';
    disableButton('play-again-btn', false);
  }
}
