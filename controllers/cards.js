const Card = require('../models/Card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const newCard = await new Card(req.body);
    res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'Error' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = Card.findByIdAndRemove(cardId);
    if (!card) throw new Error({ status: 'not found', message: 'Такой карточки нет' });
    return res.status(200).send(card);
  } catch (err) {
    const { cardId } = req.params;
    if (!Card.findById(cardId).owner.equals(req.user._id)) {
      return res.status(403).send({ message: 'Попытка удалить чужую карточку' });
    }
    if (Card.findById(cardId) === null) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.status(500).send({ message: 'Error' });
  }
};

const likeCard = async (req, res) => {
  try {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    return res.status(200).send(Card.findById(req.params.cardId));
  } catch (err) {
    if (Card.findById(req.params.cardId) === null) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.status(500).send({ message: 'Error' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    return res.status(200).send(Card.findById(req.params.cardId));
  } catch (err) {
    if (Card.findById(req.params.cardId) === null) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.status(500).send({ message: 'Error' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
