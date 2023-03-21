// мидлвэр авторизации
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  // извлечем токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Нет доступа');
    }
    next(err);
  }

  req.user = payload; // записали пейлоуд в объект запроса
  next();
};
