'use strict';

const Constants = Object.freeze({
  WORD_SIZE: 5,
  MAX_ATTEMPTS: 6,
});

const Matches = {
  EXACT_MATCH: 'Exact Match',
  PARTIAL_MATCH: 'Partial Match',
  NO_MATCH: 'No Match',
};

const GameStatus = {
  WIN: 'Win',
  IN_PROGRESS: 'In Progress',
  LOSS: 'Game Lost',
};

const GameMessage = {
  WIN_MESSAGE: ['Amazing', 'Splendid', 'Awesome', 'Yay'],
  INVALID_GUESS_MESSAGE: `Guess must be ${Constants.WORD_SIZE} letters long`,
  IN_PROGRESS_MESSAGE: 'Keep guessing!',
  NO_ATTEMPTS_REMAINING: `There can only be ${Constants.MAX_ATTEMPTS} attempts`,
};

const { WORD_SIZE, MAX_ATTEMPTS } = Constants;
const { EXACT_MATCH, NO_MATCH, PARTIAL_MATCH } = Matches;
const { WIN, IN_PROGRESS, LOSS } = GameStatus;
const {
  WIN_MESSAGE,
  INVALID_GUESS_MESSAGE,
  IN_PROGRESS_MESSAGE,
  NO_ATTEMPTS_REMAINING,
} = GameMessage;

function validateLength(guess) {
  if (guess.length !== WORD_SIZE) {
    throw new Error(INVALID_GUESS_MESSAGE);
  }
}

function tally(target, guess) {
  validateLength(guess);

  return guess.split('').map((letter, position) => {
    return tallyForPosition(position, target, guess);
  });
}

function tallyForPosition(position, target, guess) {
  if (target[position] === guess[position]) {
    return EXACT_MATCH;
  }

  const letterAtPosition = guess[position];
  const positionalMatches = countExactMatches(target, guess, letterAtPosition);
  const nonPositionalOccurrencesInTarget =
    countNumberOfOccurrencesUntilPosition(
      WORD_SIZE - 1,
      target,
      letterAtPosition,
    ) - positionalMatches;
  const numberOfOccurrencesInGuessUntilPosition =
    countNumberOfOccurrencesUntilPosition(position, guess, letterAtPosition);

  return nonPositionalOccurrencesInTarget >=
    numberOfOccurrencesInGuessUntilPosition
    ? PARTIAL_MATCH
    : NO_MATCH;
}

function countExactMatches(target, guess, guessLetter) {
  return target
    .split('')
    .filter((_, index) => target[index] === guess[index])
    .filter((targetLetter) => targetLetter === guessLetter).length;
}

function countNumberOfOccurrencesUntilPosition(position, word, letter) {
  const matches = word
    .substring(0, position + 1)
    .match(new RegExp(letter, 'g'));

  return matches ? matches.length : 0;
}

function play(attempts, target, guess, isSpellingCorrect = word => true) { 
  validateAttempts(attempts + 1);
  
  if(!isSpellingCorrect(guess)) {
    throw Error('Not a word');
  }

  const tallyResult = tally(target, guess);
  const gameStatus = getGameStatus(tallyResult, attempts + 1);
  const gameMessage = getGameMessage(target, tallyResult, attempts + 1);

  return createResponse(attempts + 1, tallyResult, gameStatus, gameMessage);
}

function validateAttempts(currentAttempt) {
  if (currentAttempt > MAX_ATTEMPTS) {
    throw new Error(NO_ATTEMPTS_REMAINING);
  }
}

function getGameStatus(tallyResult, currentAttempt) {
  if (tallyResult.every((response) => response === EXACT_MATCH)) {
    return WIN;
  }

  return currentAttempt < MAX_ATTEMPTS ? IN_PROGRESS : LOSS;
}

function getGameMessage(target, tallyResult, currentAttempt) {
  if (tallyResult.every((response) => response === EXACT_MATCH)) {
    const winningMessages = ['Amazing', 'Splendid', 'Awesome', 'Yay', 'Yay', 'Yay'];

    GameMessage.WIN_MESSAGE = winningMessages[currentAttempt - 1];

    return GameMessage.WIN_MESSAGE;
  }


  return currentAttempt < MAX_ATTEMPTS
    ? IN_PROGRESS_MESSAGE
    : `It was ${target}, better luck next time`;
}

function createResponse(currentAttempt, tallyResult, gameStatus, gameMessage) {
  return {
    attempts: currentAttempt,
    wordResponse: tallyResult,
    gameStatus: gameStatus,
    message: gameMessage,
  };
}

module.exports = { tally, play, Constants, Matches, GameStatus, GameMessage };
