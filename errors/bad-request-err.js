const { resStatuses } = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = resStatuses.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
