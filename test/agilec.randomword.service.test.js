'use strict';

const randomWord = require('../routes/agilec.randomword.service.js');

const fetchMock = require('jest-fetch-mock').default;


fetchMock.enableMocks();

afterEach(() => jest.restoreAllMocks());

test('canary test', () => {
  expect(true).toBe(true);
});

describe('getRandomWord function', () => {
  it('returns a random word from the response', async () => {
    fetchMock.mockResponseOnce('WORD1\nWORD2\nWORD3');

    const result = await randomWord.getRandomWord();
    
    expect(typeof result).toBe('string');
  });

  it('throws an error when getResponse fails', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch'));

    await expect(randomWord.getRandomWord()).rejects.toThrow('Failed to fetch');
  });
});

describe('getResponse function', () => {
  it('returns a response from the server', async () => {
    fetchMock.mockResponseOnce('WORD1\nWORD2\nWORD3');

    const result = await randomWord.getResponse();

    expect(typeof result).toBe('string');
  });

  it('throws an error when fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch'));

    await expect(randomWord.getResponse()).rejects.toThrow('Failed to fetch');
  });
});

describe('parse function', () => {
  beforeEach(() => randomWord.chosenWords.clear());

  it('throws error on empty response', () => {
    expect(() => randomWord.parse('')).toThrow('Empty response');
  });

  it('resets availableWords and chosenWords when all words are previously chosen', () => {
    randomWord.chosenWords = new Set(['WORD1', 'WORD2', 'WORD3']);

    const response = 'WORD1\nWORD2\nWORD3';
    const word = randomWord.parse(response);

    expect(['WORD1', 'WORD2', 'WORD3']).toContain(word);
    expect(randomWord.chosenWords.size).toBe(1);
  });
});
