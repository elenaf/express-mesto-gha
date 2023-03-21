const express = require('express'); // подключили express

const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const router = express.Router(); // создали объект роута
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const validateUrl = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error('Invalid url');
  }
  return value;
};

// роутинг для логина
router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
  }),
}), login);

// роутинг для создания пользователя
router.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
  }),
}), createUser);

// роутинг для авторизации
router.use(auth);

// роутинг для пользователей
router.use('/users', usersRoutes);

// роутинг для карточек
router.use('/cards', cardsRoutes);

// обработка несуществующего пути
router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
