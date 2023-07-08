const Errors = require('../ErrorBlueprint');

class InternalServerError extends Errors {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
