const express = require('express');

const cardsRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const validateUrl = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error('Invalid url');
  }
  return value;
};

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(validateUrl).required(),
    owner: Joi.string(),
  }).unknown(true),
}), createCard);
cardsRoutes.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
cardsRoutes.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);
cardsRoutes.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = cardsRoutes;
