const { resStatuses } = require('../utils/constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = resStatuses.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
