// функциональность точки входа
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router'); // импортируем роутер

const app = express();

app.use(router); // запускаем роутер.

// обработчик ошибок celebrate
app.use(errors());

// миддлвэр обработки ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Ошибка сервера'
      : message,
  });
  next(); // это мне кажется убрать надо, нафиг тут некст?
});

// подключение к базе данных
async function connect() {
  await mongoose.connect('mongodb://localhost:27017/mestodb'); // подключаемся к БД
  await app.listen(3000);
}

connect();
