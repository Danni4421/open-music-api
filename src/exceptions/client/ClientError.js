const Errors = require('../ErrorBlueprint');

class ClientError extends Errors {
  constructor(message) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = 400;
  }
}

module.exports = ClientError;
