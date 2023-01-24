const mongoose = require('mongoose');/*
const user = require('./User'); */

// Создали схему
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Создали модель и экспортировали ее
module.exports = mongoose.model('card', cardSchema);
