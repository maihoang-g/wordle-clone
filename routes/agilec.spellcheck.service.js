'use strict';

const spellCheck = {
  isSpellingCorrect: async (word) => {
    const response = await spellCheck.getResponse(word).catch(error => {
      throw new Error(error);
    });

    return spellCheck.parse(response);
  },

  getResponse: async (word) => {
    const response = await fetch(`http://agilec.cs.uh.edu/spellcheck?check=${word}`).catch(error => {
      throw new Error(error);
    });

    return await response.text();
  },

  parse: (response) => {
    if (!['true', 'false'].includes(response)) {
      throw new Error('Response is expected to be true or false');
    }

    return response === 'true';
  }
};


module.exports = spellCheck; 
