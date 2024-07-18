'use strict';

const express = require('express');
const server = express();
const port = 3000;

const spellCheck = require('./routes/agilec.spellcheck.service.js');
const randomWord = require('./routes/agilec.randomword.service.js');

server.use(express.static('public'));

server.get('/spellcheck/:word', async (req, res) => {
  const response = await spellCheck.isSpellingCorrect(req.params.word);
  
  return res.send({ 'isSpellingCorrect': response });
});

server.get('/randomword', async (req, res) => {
  const response = await randomWord.getRandomWord();

  return res.send({ 'word': response });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
