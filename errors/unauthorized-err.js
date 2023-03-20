const { resStatuses } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = resStatuses.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
