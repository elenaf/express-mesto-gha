const express = require('express'); // подключили express

const { celebrate, Joi } = require('celebrate');

/* const {
  NOT_FOUND,
} = require('../utils/constants'); */

const router = express.Router(); // создали объект роута
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

// роутинг для логина
router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }), /*
  headers: Joi.object().keys({
    Authorization: Joi.string().required(),
  }).unknown(true), */
}), login);

// роутинг для создания пользователя
router.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
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
  // res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
