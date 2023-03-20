const Card = require('../models/Card');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
/* const ForbiddenError = require('../errors/forbidden-err');
const InternalServerError = require('../errors/internal-server-err');
const UnauthorizedError = require('../errors/unauthorized-err'); */

const {
  resStatuses,
} = require('../utils/constants');

const {
  OK,
  CREATED,
/*   BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR, */
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
      // res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    } else {
      next(err);
      // res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
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
      throw new ConflictError('Попытка удалить чужую карточку');
    }

    await Card.deleteOne(card);
    /* return  */res.status(OK).send(card);
  } catch (err) {
    /* if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    } */
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
      // return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    /* if (err.message === 'Conflict') {
      return res.status(FORBIDDEN).send({ message: 'Попытка удалить чужую карточку' });
    } */
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
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
    /* return  */res.status(OK).send(card);
  } catch (err) {
    /* if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    } */
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
      // return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
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
    /* return  */res.status(OK).send(card);
  } catch (err) {
    /* if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    } */
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
      // return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
