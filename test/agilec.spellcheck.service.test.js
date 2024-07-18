'use strict';

const spellCheck = require('../routes/agilec.spellcheck.service.js');

const fetchMock = require('jest-fetch-mock').default;

fetchMock.enableMocks();

afterEach(() => jest.restoreAllMocks());

test('canary test', () => {
  expect(true).toBe(true);
});

describe('getResponse function', () => {

  it('returns true for input "FAVOR"', async () => {
    fetchMock.mockResponseOnce('true', { url: '/spellcheck' });

    const result = await spellCheck.getResponse('FAVOR');

    expect(result).toBe('true');
  });

  it('returns false for input "FAVRO"', async () => {
    fetchMock.mockResponseOnce('false', { url: '/spellcheck' });

    const result = await spellCheck.getResponse('FAVRO');

    expect(result).toBe('false');
  });
});

describe('test parse function', () => {

  it.each([
    ['true', true],
    ['false', false]
  ])('call parse with argument \'%s\' returns %s', (text, expected) => {
    expect(spellCheck.parse(text)).toBe(expected);
  });

  it('any other value raises a ValueError', () => {
    expect(() => spellCheck.parse('invalid response')).toThrow('Response is expected to be true or false');
  });
});

describe('test isSpellingCorrect()', () => {

  it.each([
    ['FAVOR', 'true', true],
    ['FARRR', 'false', false]
  ])('takes \'%s\' calls getResponse and parse to return %s', async (guess, text, expected) => {
    const getResponseSpy = jest.spyOn(spellCheck, 'getResponse').mockResolvedValue(text);
    const parseSpy = jest.spyOn(spellCheck, 'parse').mockReturnValue(expected);

    const result = await spellCheck.isSpellingCorrect(guess);

    expect(getResponseSpy).toHaveBeenCalledWith(guess);
    expect(parseSpy).toHaveBeenCalledWith(text);
    expect(result).toBe(expected);
  });

  it('getResponse fails fetch and isSpellingCorrect throws the same exception', async () => {
    const error = 'Something went wrong when fetching to spell check service';

    fetchMock.mockRejectOnce(error);
    const parseSpy = jest.spyOn(spellCheck, 'parse');

    await expect(spellCheck.isSpellingCorrect('FAVOR')).rejects.toThrow(error);
    expect(parseSpy).not.toHaveBeenCalled();
  });
});
