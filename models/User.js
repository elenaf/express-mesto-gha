const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: false,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Введите ссылку',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Введите корректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.password;

  return data;
};

module.exports = mongoose.model('user', userSchema);
