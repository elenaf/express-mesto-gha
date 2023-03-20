const { resStatuses } = require('../utils/constants');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = resStatuses.INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
