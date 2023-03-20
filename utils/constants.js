const resStatuses = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const errCodes = {
  MONGO_DUPLICATE_ERROR_CODE: 11000,
};

const SALT_ROUNDS = 10;

module.exports = {
  resStatuses,
  errCodes,
  SALT_ROUNDS,
};
