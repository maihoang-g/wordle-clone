'use strict';

const { tally,
  play,
  Matches: { EXACT_MATCH, NO_MATCH, PARTIAL_MATCH },
  GameStatus: { WIN, IN_PROGRESS, LOSS },
  GameMessage: { WIN_MESSAGE, INVALID_GUESS_MESSAGE, IN_PROGRESS_MESSAGE, NO_ATTEMPTS_REMAINING } } = require('../routes/wordle.js');


test('canary test', () => {
  expect(true).toBe(true);
});

describe('test tally()', () => {

  it.each([
    ['FAVOR', 'FAVOR', [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH]],
    ['FAVOR', 'TESTS', [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH]],
    ['FAVOR', 'RAPID', [PARTIAL_MATCH, EXACT_MATCH, NO_MATCH, NO_MATCH, NO_MATCH]],
    ['FAVOR', 'MAYOR', [NO_MATCH, EXACT_MATCH, NO_MATCH, EXACT_MATCH, EXACT_MATCH]],
    ['FAVOR', 'RIVER', [NO_MATCH, NO_MATCH, EXACT_MATCH, NO_MATCH, EXACT_MATCH]],
    ['FAVOR', 'AMAST', [PARTIAL_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH]]
  ])('compare target %p and guess %p', (target, guess, expected) => {
    expect(tally(target, guess)).toEqual(expected);
  });

  it.each([
    ['FAVOR', 'FOR'],
    ['FAVOR', 'FERVER'],
  ])('throw length error for target %p and guess %p', (target, guess) => {
    expect(() => { tally(target, guess); }).toThrow(INVALID_GUESS_MESSAGE);
  });

  it.each([
    ['SKILL', 'SKILL', [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH]],
    ['SKILL', 'SWIRL', [EXACT_MATCH, NO_MATCH, EXACT_MATCH, NO_MATCH, EXACT_MATCH]],
    ['SKILL', 'CIVIL', [NO_MATCH, PARTIAL_MATCH, NO_MATCH, NO_MATCH, EXACT_MATCH]],
    ['SKILL', 'SHIMS', [EXACT_MATCH, NO_MATCH, EXACT_MATCH, NO_MATCH, NO_MATCH]],
    ['SKILL', 'SILLY', [EXACT_MATCH, PARTIAL_MATCH, PARTIAL_MATCH, EXACT_MATCH, NO_MATCH]],
    ['SKILL', 'SLICE', [EXACT_MATCH, PARTIAL_MATCH, EXACT_MATCH, NO_MATCH, NO_MATCH]],
  ])('compare target %p and guess %p', (target, guess, expected) => {
    expect(tally(target, guess)).toEqual(expected);
  });
});

describe('test play()', () => {

  it.each([
    [0, 'FAVOR', 'FAVOR', {
      attempts: 1,
      wordResponse: [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH],
      gameStatus: WIN,
      message: 'Amazing'
    }],
    [0, 'FAVOR', 'TESTS', {
      attempts: 1,
      wordResponse: [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH],
      gameStatus: IN_PROGRESS,
      message: IN_PROGRESS_MESSAGE
    }],
    [1, 'FAVOR', 'FAVOR', {
      attempts: 2,
      wordResponse: [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH],
      gameStatus: WIN,
      message: 'Splendid'
    }],
    [1, 'FAVOR', 'TESTS', {
      attempts: 2,
      wordResponse: [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH],
      gameStatus: IN_PROGRESS,
      message: IN_PROGRESS_MESSAGE
    }],
    [2, 'FAVOR', 'FAVOR', {
      attempts: 3,
      wordResponse: [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH],
      gameStatus: WIN,
      message: 'Awesome'
    }],
    [2, 'FAVOR', 'TESTS', {
      attempts: 3,
      wordResponse: [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH],
      gameStatus: IN_PROGRESS,
      message: IN_PROGRESS_MESSAGE
    }],
    [3, 'FAVOR', 'FAVOR', {
      attempts: 4,
      wordResponse: [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH],
      gameStatus: WIN,
      message: 'Yay'
    }],
    [3, 'FAVOR', 'TESTS', {
      attempts: 4,
      wordResponse: [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH],
      gameStatus: IN_PROGRESS,
      message: IN_PROGRESS_MESSAGE
    }],
    [3, 'FAVOR', 'FAVOR', {
      attempts: 4,
      wordResponse: [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH],
      gameStatus: WIN,
      message: 'Yay'
    }],
    [3, 'FAVOR', 'TESTS', {
      attempts: 4,
      wordResponse: [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH],
      gameStatus: IN_PROGRESS,
      message: IN_PROGRESS_MESSAGE
    }],
    [4, 'FAVOR', 'FAVOR', {
      attempts: 5,
      wordResponse: [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH],
      gameStatus: WIN,
      message: 'Yay'
    }],
    [4, 'FAVOR', 'TESTS', {
      attempts: 5,
      wordResponse: [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH],
      gameStatus: IN_PROGRESS,
      message: IN_PROGRESS_MESSAGE
    }],
    [5, 'FAVOR', 'FAVOR', {
      attempts: 6,
      wordResponse: [EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH, EXACT_MATCH],
      gameStatus: WIN,
      message: 'Yay'
    }],
    [5, 'FAVOR', 'TESTS', {
      attempts: 6,
      wordResponse: [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH],
      gameStatus: LOSS,
      message: 'It was FAVOR, better luck next time'
    }],
  ])('%d previous attempts and play target %p and guess %p', (attempt, target, guess, expected) => {
    expect(play(attempt, target, guess)).toEqual(expected);
  });

  it.each([
    [0, 'FAVOR', 'FOR'],
  ])('attempt to play target %p and guess %p with length error', (attempt, target, guess) => {
    expect(() => play(attempt, target, guess)).toThrow(INVALID_GUESS_MESSAGE);
  });

  it.each([
    [7, 'FAVOR', 'FAVOR'],
    [8, 'FAVOR', 'RIVER']
  ])('attempt to play when there are no more remaining attempts', (attempt, target, guess) => {
    expect(() => play(attempt, target, guess)).toThrow(NO_ATTEMPTS_REMAINING);
  });
});

describe('test spell check on play()', () => {

  it('throw spelling exception when FEVER is considered incorrect spelling', () => {
    expect(() => play(1, 'FAVOR', 'FEVER', word => false)).toThrow('Not a word');
  });

  it('return proper response when FEVER is considered correct spelling', () => {
    expect(play(1, 'FAVOR', 'FEVER', word => true)).toEqual({ 
      attempts: 2,
      wordResponse: [EXACT_MATCH, NO_MATCH, EXACT_MATCH, NO_MATCH, EXACT_MATCH],
      gameStatus: IN_PROGRESS,
      message: IN_PROGRESS_MESSAGE
    });
  });

  it('throw exception where checking for spelling results in an exception', () => {
    function isSpellingCorrect(word) { 
      throw new Error('Not a word');
    }

    expect(() => play(1, 'FAVOR', 'FEVER', isSpellingCorrect)).toThrow('Not a word'); 
  });
});
