class Errors extends Error {
  constructor(message) {
    super(message);
    this.name = 'Error';
  }
}

module.exports = Errors;
