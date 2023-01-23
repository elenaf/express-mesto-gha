const express = require('express'); // подключили express

const usersRoutes = require('express').Router(); // создание объекта роута

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);
usersRoutes.get('/:userId', getUserById);
usersRoutes.post('/', express.json(), createUser);
usersRoutes.patch('/me', express.json(), updateProfile);
usersRoutes.patch('/me/avatar', express.json(), updateAvatar);

module.exports = usersRoutes;
