const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
// const ForbiddenError = require('../errors/forbidden-err');
const InternalServerError = require('../errors/internal-server-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const {
  resStatuses,
  errCodes,
  SALT_ROUNDS,
} = require('../utils/constants');

const {
  OK,
  CREATED,
  /* BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR, */
} = resStatuses;

const {
  MONGO_DUPLICATE_ERROR_CODE,
} = errCodes;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (err) {
    next(err);
    // res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('Пользователь не найден');
    /* return  */res.status(OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
      // return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    if (err.message === 'NotFound') {
      next(new NotFoundError('Пользователь не найден'));
      // return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR).send();
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('NotFound');
    /* return  */res.status(OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
      // return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    if (err.message === 'NotFound') {
      next(new NotFoundError('Пользователь не найден'));
      // return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR).send();
  }
};

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email) {
    throw new BadRequestError('Введите email');
  }
  if (!password) {
    throw new BadRequestError('Введите пароль');
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await new User({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(CREATED).send(await (await newUser.save()).toJSON());
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Данный email уже используется'));
    }
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    }
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) throw new NotFoundError('NotFound');
    res.status(OK).send(user);
  } catch (err) {
    if (err.message === 'NotFound') {
      next(new NotFoundError('Некорректные данные'));
      // res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
      // res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    }
    next(err);
    // res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) throw new NotFoundError('NotFound');
    res.status(OK).send(user);
  } catch (err) {
    if (err.message === 'NotFound') {
      next(new NotFoundError('Пользователь не найден'));
      // res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
      // res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    }
    next(err);
    // res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

const login = async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  if (!email) {
    throw new BadRequestError('Введите email');
    // return res.status(BAD_REQUEST).send({ message: 'Введите email' });
  }
  if (!password) {
    throw new BadRequestError('Введите пароль');
    // return res.status(BAD_REQUEST).send({ message: 'Введите пароль' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedError('Unauthorized');
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) throw new UnauthorizedError('Unauthorized');
    const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });
    /* return  */res.status(OK).send({ message: 'Welcome!', token });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      next(new UnauthorizedError('Некорректный email или пароль'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректный email или пароль'));
    }

    // return res.status(UNAUTHORIZED).send({ message: 'Некорректный email или пароль' });
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
