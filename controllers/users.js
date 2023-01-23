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
    /* if (!user) throw new Error('not found'); */
    return res.status(200).send(user);
  } catch (err) {
    const { userId } = req.params;
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка валидации ID', ...err });
    }
    // if (err.message === 'not found') {return res.status(404).send({ message: 'Не найден' })}
    if (User.findById(userId) === null) {
      return res.status(404).send({ message: 'Такой пользователь не найден' });
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

const updateProfile = (req, res) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;
    User.findByIdAndUpdate(userId, { name, about });
    res.send(req.body);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'Error' });
    }
  }
};

const updateAvatar = (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    User.findByIdAndUpdate(userId, { avatar });
    res.send(req.body);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
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
