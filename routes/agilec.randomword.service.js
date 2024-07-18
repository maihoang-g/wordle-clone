'use strict';

const randomWord = {
  chosenWords: new Set(),

  getRandomWord: async () => {
    const response = await randomWord.getResponse().catch(error => {
      throw new Error(error);
    });

    return randomWord.parse(response);
  },

  getResponse: async () => {
    const response = await fetch('https://agilec.cs.uh.edu/words').catch(error => {
      throw new Error(error);
    });

    return await response.text();
  },


  parse: (response) => {
    if (!response || response.trim() === '') {
      throw new Error('Empty response');
    }

    const wordsList = response.split('\n').filter(word => word.trim() !== '');

    let availableWords = wordsList.filter(word => !randomWord.chosenWords.has(word));

    if (availableWords.length === 0) {
      availableWords = wordsList;
      randomWord.chosenWords.clear();
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const chosenWord = availableWords[randomIndex];

    randomWord.chosenWords.add(chosenWord);

    return chosenWord;
  }
};

module.exports = randomWord; 
