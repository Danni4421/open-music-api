const Errors = require('../ErrorBlueprint');

class ServiceUnavailableError extends Errors {
  constructor(message) {
    super(message);
    this.name = 'ServiceUnavailable';
    this.statusCode = 503;
  }
}

module.exports = ServiceUnavailableError;
