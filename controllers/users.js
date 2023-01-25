const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw new Error('NotFound');
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка валидации ID', ...err });
    }
    if (err.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.status(500).send();
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    res.status(201).send(await newUser.save());
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'Error' });
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
    res.status(200).send(user);
  } catch (err) {
    if (err.message === 'NotFound') {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'Error' });
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
    res.status(200).send(user);
  } catch (err) {
    if (err.message === 'NotFound') {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'Error' });
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
