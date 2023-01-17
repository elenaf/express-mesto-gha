const express = require('express'); // подключили express

const usersRoutes = require('express').Router(); // создание объекта роута

const { getUsers, getUserById, createUser } = require('../controllers/users');

usersRoutes.get('/', getUsers);
usersRoutes.get('/:userId', getUserById);
usersRoutes.post('/', express.json(), createUser);

module.exports = usersRoutes;
