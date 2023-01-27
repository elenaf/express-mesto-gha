const Card = require('../models/Card');
const {
  OK,
  CREATED,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(OK).send(cards);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const newCard = await new Card({ name, link, owner }).populate('owner');
    res.status(CREATED).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new Error('NotFound');
    }
    if (!card.owner.equals(req.user._id)) {
      throw new Error('Conflict');
    }

    await Card.deleteOne(card);
    return res.status(OK).send(card);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    if (err.message === 'Conflict') {
      return res.status(FORBIDDEN).send({ message: 'Попытка удалить чужую карточку' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).populate(['likes', 'owner']);
    if (!card) throw new Error('NotFound');
    return res.status(OK).send(card);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).populate(['likes', 'owner']);
    if (!card) throw new Error('NotFound');
    return res.status(OK).send(card);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
