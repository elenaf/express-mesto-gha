const express = require('express'); // подключили express

const router = express.Router(); // создали объект роута
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

// роутинг для пользователей
router.use('/users', usersRoutes);

// роутинг для карточек
router.use('/cards', cardsRoutes);

// обработка несуществующего пути
router.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
