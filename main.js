"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// routes/wordle.js
var require_wordle = __commonJS({
  "routes/wordle.js"(exports, module2) {
    "use strict";
    var Constants = Object.freeze({
      WORD_SIZE: 5,
      MAX_ATTEMPTS: 6
    });
    var Matches = {
      EXACT_MATCH: "Exact Match",
      PARTIAL_MATCH: "Partial Match",
      NO_MATCH: "No Match"
    };
    var GameStatus = {
      WIN: "Win",
      IN_PROGRESS: "In Progress",
      LOSS: "Game Lost"
    };
    var GameMessage = {
      WIN_MESSAGE: ["Amazing", "Splendid", "Awesome", "Yay"],
      INVALID_GUESS_MESSAGE: `Guess must be ${Constants.WORD_SIZE} letters long`,
      IN_PROGRESS_MESSAGE: "Keep guessing!",
      NO_ATTEMPTS_REMAINING: `There can only be ${Constants.MAX_ATTEMPTS} attempts`
    };
    var { WORD_SIZE: WORD_SIZE2, MAX_ATTEMPTS: MAX_ATTEMPTS2 } = Constants;
    var { EXACT_MATCH: EXACT_MATCH2, NO_MATCH, PARTIAL_MATCH: PARTIAL_MATCH2 } = Matches;
    var { WIN: WIN2, IN_PROGRESS: IN_PROGRESS2, LOSS: LOSS2 } = GameStatus;
    var {
      WIN_MESSAGE,
      INVALID_GUESS_MESSAGE,
      IN_PROGRESS_MESSAGE,
      NO_ATTEMPTS_REMAINING
    } = GameMessage;
    function validateLength(guess) {
      if (guess.length !== WORD_SIZE2) {
        throw new Error(INVALID_GUESS_MESSAGE);
      }
    }
    function tally(target, guess) {
      validateLength(guess);
      return guess.split("").map((letter, position) => {
        return tallyForPosition(position, target, guess);
      });
    }
    function tallyForPosition(position, target, guess) {
      if (target[position] === guess[position]) {
        return EXACT_MATCH2;
      }
      const letterAtPosition = guess[position];
      const positionalMatches = countExactMatches(target, guess, letterAtPosition);
      const nonPositionalOccurrencesInTarget = countNumberOfOccurrencesUntilPosition(
        WORD_SIZE2 - 1,
        target,
        letterAtPosition
      ) - positionalMatches;
      const numberOfOccurrencesInGuessUntilPosition = countNumberOfOccurrencesUntilPosition(position, guess, letterAtPosition);
      return nonPositionalOccurrencesInTarget >= numberOfOccurrencesInGuessUntilPosition ? PARTIAL_MATCH2 : NO_MATCH;
    }
    function countExactMatches(target, guess, guessLetter) {
      return target.split("").filter((_, index) => target[index] === guess[index]).filter((targetLetter) => targetLetter === guessLetter).length;
    }
    function countNumberOfOccurrencesUntilPosition(position, word, letter) {
      const matches = word.substring(0, position + 1).match(new RegExp(letter, "g"));
      return matches ? matches.length : 0;
    }
    function play2(attempts, target, guess, isSpellingCorrect = (word) => true) {
      validateAttempts(attempts + 1);
      if (!isSpellingCorrect(guess)) {
        throw Error("Not a word");
      }
      const tallyResult = tally(target, guess);
      const gameStatus = getGameStatus(tallyResult, attempts + 1);
      const gameMessage = getGameMessage(target, tallyResult, attempts + 1);
      return createResponse(attempts + 1, tallyResult, gameStatus, gameMessage);
    }
    function validateAttempts(currentAttempt2) {
      if (currentAttempt2 > MAX_ATTEMPTS2) {
        throw new Error(NO_ATTEMPTS_REMAINING);
      }
    }
    function getGameStatus(tallyResult, currentAttempt2) {
      if (tallyResult.every((response) => response === EXACT_MATCH2)) {
        return WIN2;
      }
      return currentAttempt2 < MAX_ATTEMPTS2 ? IN_PROGRESS2 : LOSS2;
    }
    function getGameMessage(target, tallyResult, currentAttempt2) {
      if (tallyResult.every((response) => response === EXACT_MATCH2)) {
        const winningMessages = ["Amazing", "Splendid", "Awesome", "Yay", "Yay", "Yay"];
        GameMessage.WIN_MESSAGE = winningMessages[currentAttempt2 - 1];
        return GameMessage.WIN_MESSAGE;
      }
      return currentAttempt2 < MAX_ATTEMPTS2 ? IN_PROGRESS_MESSAGE : `It was ${target}, better luck next time`;
    }
    function createResponse(currentAttempt2, tallyResult, gameStatus, gameMessage) {
      return {
        attempts: currentAttempt2,
        wordResponse: tallyResult,
        gameStatus,
        message: gameMessage
      };
    }
    module2.exports = { tally, play: play2, Constants, Matches, GameStatus, GameMessage };
  }
});

// routes/index.js
var {
  play,
  Constants: { WORD_SIZE, MAX_ATTEMPTS },
  Matches: { EXACT_MATCH, PARTIAL_MATCH },
  GameStatus: { WIN, IN_PROGRESS, LOSS }
} = require_wordle();
var nextLetter;
var currentAttempt;
var currentGuess;
var targetWord;
document.addEventListener("DOMContentLoaded", function() {
  setUpNewGame();
});
document.addEventListener("keyup", function(event) {
  event.preventDefault();
  const pressedKey = String(event.key);
  if (pressedKey === "Backspace") {
    removeLetter();
    return;
  }
  if (pressedKey === "Enter" && nextLetter === WORD_SIZE) {
    submitGuess();
    return;
  }
  if (pressedKey === "Enter" && nextLetter === -1) {
    setUpNewGame();
    return;
  }
  const isLetter = pressedKey.match(/[a-z]/gi);
  if (isLetter && isLetter.length === 1 && nextLetter < WORD_SIZE && nextLetter !== -1 && currentAttempt < MAX_ATTEMPTS) {
    insertLetter(pressedKey);
  }
  disableButton("submit-btn", currentGuess.length !== WORD_SIZE);
});
async function setUpNewGame() {
  nextLetter = 0;
  currentAttempt = 0;
  currentGuess = "";
  const newWord = await fetch("/randomword").then((res) => res.json());
  targetWord = newWord.word;
  const grid = document.querySelector(".grid");
  grid.innerHTML = "";
  showMessage("");
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const row = document.createElement("div");
    row.className = "letter-row";
    for (let j = 0; j < WORD_SIZE; j++) {
      const cell = document.createElement("div");
      cell.className = "letter-cell";
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
  disableButton("play-again-btn", true);
  disableButton("submit-btn", true);
  document.getElementsByClassName("submit-btn")[0].style.display = "inline";
  document.getElementsByClassName("play-again-btn")[0].style.display = "none";
}
function disableButton(className, isDisabled) {
  document.getElementsByClassName(className)[0].disabled = isDisabled;
}
async function submitGuess() {
  const data = await fetch(`/spellcheck/${currentGuess}`).then((res) => res.json());
  if (!data.isSpellingCorrect) {
    showMessage("Not a word, please try a new word before submitting again");
    disableButton("submit-btn", true);
    return;
  }
  const response = play(currentAttempt, targetWord, currentGuess);
  checkGameStatus(response.gameStatus);
  updateRowColors(response.wordResponse);
  showMessage(response.message);
  disableButton("submit-btn", true);
  currentAttempt = response.attempts;
  nextLetter = response.gameStatus === IN_PROGRESS ? 0 : -1;
  currentGuess = "";
}
function insertLetter(pressedKey) {
  pressedKey = pressedKey.toUpperCase();
  const row = document.getElementsByClassName("letter-row")[currentAttempt];
  const cell = row.children[nextLetter];
  cell.textContent = pressedKey;
  currentGuess += pressedKey;
  cell.classList.add("filled-cell");
  nextLetter += 1;
}
function removeLetter() {
  if (nextLetter !== 0) {
    const row = document.getElementsByClassName("letter-row")[currentAttempt];
    const cell = row.children[nextLetter - 1];
    cell.textContent = "";
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    cell.classList.remove("filled-cell");
    nextLetter -= 1;
  }
}
function updateRowColors(wordResponse) {
  const row = document.getElementsByClassName("letter-row")[currentAttempt];
  wordResponse.map((letterStatus, position) => {
    const cell = row.children[position];
    if (letterStatus === EXACT_MATCH) {
      cell.classList.add("correct");
      return;
    }
    if (letterStatus === PARTIAL_MATCH) {
      cell.classList.add("partial");
      return;
    }
    cell.classList.add("incorrect");
  });
}
function showMessage(message) {
  const messageDiv = document.getElementById("game-message");
  messageDiv.textContent = message;
}
function checkGameStatus(gameStatus) {
  if (gameStatus === WIN || gameStatus === LOSS) {
    document.getElementsByClassName("submit-btn")[0].style.display = "none";
    document.getElementsByClassName("play-again-btn")[0].style.display = "inline";
    disableButton("play-again-btn", false);
  }
}
