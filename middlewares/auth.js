// мидлвэр авторизации
const jwt = require('jsonwebtoken');

// const { resStatuses } = require('../utils/constants');

// const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = resStatuses;

const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
    // return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  // извлечем токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Нет доступа');
      // return res.status(UNAUTHORIZED).send({ message: 'Нет доступа' });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }

  req.user = payload; // записали пейлоуд в объект запроса
  next();
};
