const Card = require('../models/Card');

const getCards = async (req, res) => {
  const cards = await Card.find({});
  res.status(200).send(users);
};

const createCard = async (req, res) => {
  try {
    const newCard = await new Card(req.body);
    res.status(201).send(await newCard.save());
  } catch (err) {
    res.status(500).send({ message: 'Error'});
  }
};

const deleteCard = async (req, res) => {

}

module.exports = {
  getCards,
  createCard,
  deleteCard,
};