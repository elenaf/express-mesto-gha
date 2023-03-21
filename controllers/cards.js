const Card = require('../models/Card');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const {
  resStatuses,
} = require('../utils/constants');

const {
  OK,
  CREATED,
} = resStatuses;

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate('owner');
    res.status(OK).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const newCard = await new Card({ name, link, owner }).populate('owner');
    res.status(CREATED).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(err);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (!card.owner.equals(req.user._id)) {
      throw new ForbiddenError('Попытка удалить чужую карточку');
    }

    await Card.deleteOne(card);
    res.status(OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).populate(['likes', 'owner']);
    if (!card) throw new NotFoundError('NotFound');
    res.status(OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).populate(['likes', 'owner']);
    if (!card) throw new NotFoundError('NotFound');
    res.status(OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
