// функциональность точки входа
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router'); // импортируем роутер

const app = express();

app.use(router); // запускаем роутер.

app.use((req, res, next) => {
  req.user = {
    _id: '63c5c9d47182fab491a733a8', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// подключение к базе данных
async function connect() {
  await mongoose.connect('mongodb://localhost:27017/mestodb'); // подключаемся к БД
  console.log('Server connected to db');
  await app.listen(3000);
  console.log('Server listen port 3000');
}

connect();
