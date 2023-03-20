const { resStatuses } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = resStatuses.CONFLICT;
  }
}

module.exports = ConflictError;
