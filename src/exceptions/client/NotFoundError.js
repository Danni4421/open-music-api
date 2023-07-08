const Errors = require('../ErrorBlueprint');

class NotFoundError extends Errors {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
