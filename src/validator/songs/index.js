const SongsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/client/InvariantError');

const SongsPayloadValidator = {
  validateSongs: (payload) => {
    const validateResult = SongsPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = SongsPayloadValidator;
