const { resStatuses } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = resStatuses.NOT_FOUND;
  }
}

module.exports = NotFoundError;
