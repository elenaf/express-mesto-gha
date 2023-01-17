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
    if (!user) throw new Error({ status: 'not found', message: 'Пользователь не найден' });
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Неверный ID', ...err });
    }
    res.status(500).send();
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    res.status(201).send(await newUser.save());
  } catch (err) {
    res.status(500).send({ message: 'Error' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
