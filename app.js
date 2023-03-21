// функциональность точки входа
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./routes/router'); // импортируем роутер

const app = express();

dotenv.config();
const { PORT, DATABASE_URL } = process.env;

app.use(router); // запускаем роутер.

// обработчик ошибок celebrate
app.use(errors());

// миддлвэр обработки ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

// подключение к базе данных
async function connect() {
  await mongoose.connect(DATABASE_URL); // подключаемся к БД
  await app.listen(PORT);
}

connect();
