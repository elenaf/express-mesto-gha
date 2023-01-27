const User = require('../models/User');
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw new Error('NotFound');
    return res.status(OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации ID', ...err });
    }
    if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }

    return res.status(INTERNAL_SERVER_ERROR).send();
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    res.status(CREATED).send(await newUser.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
    }
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) throw new Error('NotFound');
    res.status(OK).send(user);
  } catch (err) {
    if (err.message === 'NotFound') {
      res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    } else if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) throw new Error('NotFound');
    res.status(OK).send(user);
  } catch (err) {
    if (err.message === 'NotFound') {
      res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    } else if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error' });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
