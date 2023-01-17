const express = require('express');

const cardsRoutes = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', express.json(), createCard);
cardsRoutes.delete('/:cardId', deleteCard);

module.exports = cardsRoutes;
